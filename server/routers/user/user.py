from loguru import logger
from sqlmodel import SQLModel, Session, select, exists
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status, Header



from auth import get_current_user
from auth import get_password_hash
from auth import login_for_access_token



from models import User
from models import User1
from models import Token
from models import User1Read
from models import User1Create
from models import UserAuthorization


from database import get_session





router = APIRouter()




@router.post('/users/me', response_model=User)
async def read_user_me(current_user: User = Depends(get_current_user)):
    logger.warning(__name__)
    logger.info(f"{current_user=}")
    # не использую
    return current_user



@router.get("/users/me/items/")
async def read_own_items(current_user: User = Depends(get_current_user)):
    # не использую
    return [{"item_id": "Foo", "owner": current_user.username}]



@router.post('/user/create', response_model=User1Read)
async def create_user(*, session = Depends(get_session), user: User1Create):
    user.password = get_password_hash(user.password)
    db_user1 = User1.from_orm(user)
    session.add(db_user1)
    session.commit()
    session.refresh(db_user1)
    return db_user1


@router.get('/user/get-users', response_model=list[User1])
async def read_users(session = Depends(get_session)):
    # не использую
    users = session.exec(select(User1)).all()
    return users



@router.get('/user/{user_id}')
async def read_user(*, session = Depends(get_session), user_id: int):
    # не использую
    user = session.get(User1, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user



@router.post("/user/get-token-from-client", response_model=Token)
async def login_for_access_token_from_client(*, session = Depends(get_session), user: UserAuthorization):
    return login_for_access_token(user=user, session=session)



@router.post("/user/test-headers")
async def test_headers(authorization: str | None = Header(default=None)):
    logger.info(f"{authorization=}")
    return None