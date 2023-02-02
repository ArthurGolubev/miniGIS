from loguru import logger
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse



from server.auth import get_current_user
from server.auth import get_password_hash
from server.auth import login_for_access_token



from server.models import User
from server.models import User1
from server.models import Token
from server.models import User1Read
from server.models import User1Create
from server.models import UserAuthorization


from server.database import get_session


from server.calculation.YandexDiskHadler import YandexDiskHandler





router = APIRouter(prefix='/user')




@router.get('/get-me', response_model=User1Read)
async def read_user_me(current_user: User = Depends(get_current_user)):
    logger.debug(__name__)
    return current_user




@router.get("/me/items/")
async def read_own_items(current_user: User = Depends(get_current_user)):
    # не использую
    return [{"item_id": "Foo", "owner": current_user.username}]




@router.post('/create', response_model=User1Read)
async def create_user(*, session = Depends(get_session), user: User1Create):
    user.password = get_password_hash(user.password)
    db_user1 = User1.from_orm(user)
    session.add(db_user1)
    session.commit()
    logger.success('123!')
    session.refresh(db_user1)
    logger.info(f"{db_user1=}")
    return db_user1




@router.get('/get-users', response_model=list[User1])
async def read_users(session = Depends(get_session)):
    # не использую
    users = session.exec(select(User1)).all()
    return users




@router.get('/get/{user_id}')
async def read_user(*, session = Depends(get_session), user_id: int):
    # не использую
    user = session.get(User1, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user




@router.get("/get-yandex-disk-auth-url")
async def get_yandex_disk_auth_url():
    url = YandexDiskHandler().get_yandex_disk_auth_url()
    return {"url": url}




@router.get('/get-yandex-disk-token/{code}')
async def get_yandex_disk_token(code: int, user: User1 = Depends(get_current_user), session: Session = Depends(get_session)):
    logger.warning(f"{code=}")
    token = YandexDiskHandler().get_yandex_disk_token(code)
    if not token:
        raise HTTPException(
            status_code=500,
            detail="Ошибка добавления пользовательского Yandex Disk"
        )
    logger.success(f"{token=}")
    user.yandex_token = token
    session.add(user)
    session.commit()
    session.refresh(user)
    return RedirectResponse("minigis.in-arthurs-apps.space/#/main")




@router.post("/get-token-from-client", response_model=Token)
async def login_for_access_token_from_client(user, session = Depends(get_session)):
    return login_for_access_token(user=user, session=session)


