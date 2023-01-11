import os
from loguru import logger
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select



from models import TokenData
from models import User
from models import Token
from models import User1
from models import UserAuthorization

from database import get_session




pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='miniGISToken')



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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(*, token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    logger.info(f"{token=}")
    credentinal_exeption = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credential",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        logger.debug(__name__)
        username: str = payload.get("sub")
        if username is None:
            raise credentinal_exeption
        token_data = TokenData(username=username)
    except JWTError:
        raise credentinal_exeption
    user = get_user(session=session, username=token_data.username)
    if user is None:
        raise credentinal_exeption
    return user



def login_for_access_token(session: Session, user: UserAuthorization) -> Token:
    user = authenticate_user(
        session=session,
        username=user.username,
        password=user.password
        )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

