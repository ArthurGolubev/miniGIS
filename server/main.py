import os
import strawberry

from pathlib import Path
from loguru import logger
from schema.Queries import Query
from fastapi import FastAPI, Depends
from datetime import timedelta, datetime
from strawberry.fastapi import BaseContext
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter

from fastapi import APIRouter
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm



# from API_v2_rest import router
from routers import main



from sqlmodel import Field, SQLModel, create_engine


class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: int | None = Field(default=None, index=True)



sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=True, connect_args=connect_args)



def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


SECRET_KEY = os.getenv("SECRET_KEY_TO_MAKE_SOME_JWT")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
}


@strawberry.type
class Token:
    access_token: str
    token_type: str


@strawberry.type
class TokenData:
    username: str | None = None

@strawberry.type
class User:
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


@strawberry.type
class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')



def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        logger.error('1. YEAH!')
        return False
    if not verify_password(password, user.hashed_password):
        logger.error('2. YEAH!')
        return False
    return user





def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

























class CustomContext(BaseContext):
    def __init__(self, ):
        pass









app = FastAPI()



@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    Path('./cache').mkdir(exist_ok=True)

def get_session():
    logger.info('123')
    # pass
    # with Session(engine) as session:
    #     yield session

def depends_1():
    logger.info('depends 1')

def depends_2():
    logger.info('depends 2')

async def get_context(
    strongContext: 
    # session=Depends(get_session),
    depends_1=Depends(depends_1),
    # depends_2=Depends(depends_2),
    # depends_3=Depends(oauth2_scheme),
):
    return {
        # "session": session,
        # "token": depends_3
    }



schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema, context_getter=get_context)

app.include_router(main.router, prefix='/api/v2-rest')
app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/cache', StaticFiles(directory='../server/cache/'), name='images')
app.mount('/', StaticFiles(directory='../client', html=True), name='index')
