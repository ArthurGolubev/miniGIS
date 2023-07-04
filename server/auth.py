import os
from loguru import logger
from humps import decamelize
from typing import Literal
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi.security import SecurityScopes
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select
from pydantic import ValidationError

from server.models import TokenData
from server.models import Token
from server.models import User1
from server.models import UserAuthorization
from server.models import DownloadSentinel
from server.database import engine

from server.database import get_session




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl='miniGISToken')
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="miniGISToken",
    scopes={
        "trigger_search_new_satellite_images": "права для запуска поиска новых спутниковых снимков",
        "regular_user": "права обычного пользователя",
        "administrator": "права пользователя-администратора",
        "telegram_bot": "права для взаимодействия телеграм бота с приложением"
        }
)




SECRET_KEY = os.getenv("SECRET_KEY_TO_MAKE_SOME_JWT")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3000



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)



def get_user(session: Session, username: str):
    logger.info(f"{username=}")
    statement = select(User1).where(User1.username == username)
    result = session.exec(statement)
    return result.first()



def authenticate_user(session: Session, username: str, password: str):
    user = get_user(session, username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user



def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30000)
    to_encode.update({"exp": expire})
    logger.warning(f"{to_encode=}")
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
        *,
        security_scopes: SecurityScopes,
        token: str = Depends(oauth2_scheme),
        session: Session = Depends(get_session)
        ):
    if security_scopes.scopes:
        authenticate_value = f"Bearer scope='{security_scopes.scope_str}'"
    else:
        authenticate_value = 'Bearer'
    logger.success(123)
    logger.info(f"{token=}")
    credentinal_exeption = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credential",
        headers={"WWW-Authenticate": authenticate_value}
    )



    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.debug(__name__)
        username: str = payload.get("sub")
        if username is None:
            raise credentinal_exeption
        token_scopes = payload.get('scopes', [])
        logger.warning(f"{token_scopes=}")
        token_data = TokenData(username=username, scopes=token_scopes)
    except (JWTError, ValidationError) as e:
        raise credentinal_exeption
    user = get_user(session=session, username=token_data.username)
    if user is None:
        raise credentinal_exeption
    
    for scope in security_scopes.scopes:
        if scope not in token_data.scopes:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not enough permissions",
                headers={"WWW-Authenticate": authenticate_value}
            )
    return user


# async def get_websocket_data(websocket: WebSocket, session: Session):
async def get_websocket_user(token):
    logger.success('check token from websocket')

    credentinal_exeption = WebSocketDisconnect(
        code=status.WS_1015_TLS_HANDSHAKE,
        reason='invalid JWToken, try login again'
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.debug(__name__)
        username: str = payload.get("sub")
        if username is None:
            raise credentinal_exeption
        token_data = TokenData(username=username)
    except JWTError:
        logger.error('JWT EXCEPTION!')
        raise credentinal_exeption
    with Session(engine) as session:
        user = get_user(session=session, username=token_data.username)
    if user is None:
        raise credentinal_exeption
    return user


def login_for_access_token(user: UserAuthorization, session: Session) -> Token:
    logger.info(f"{user=}")
    user1: User1 | Literal[False] = authenticate_user(
        session=session,
        username=user.username,
        password=user.password
        )
    if not user1:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    permissions = user1.permissions.split(" ") if user1.permissions else None
    access_token = create_access_token(
        data={"sub": user.username, "scopes": permissions},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

