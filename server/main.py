import os

from pathlib import Path
from loguru import logger
from datetime import timedelta
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


from database import create_db_and_tables
from database import get_session
from auth import login_for_access_token

from routers import main




from models import Token





app = FastAPI()



@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    Path('./cache').mkdir(exist_ok=True)




@app.post("/miniGISToken", response_model=Token)
async def login_for_access_token_from_api( body: OAuth2PasswordRequestForm = Depends(), session = Depends(get_session)):
    # Почему-то должен быть имено в корне проекта, через APIRouter не работает.
    # Скорее всего связано с OAuth2PasswordRequestForm
    # Оставил для возможности авторизироваться через форму на /docs
    # Для обычной авторизации с клиента сделал login_for_access_token_from_client в /routers/user/user
    return login_for_access_token(user=body, session=session)








app.include_router(main.router, prefix='/api/v2-rest')
app.mount('/cache', StaticFiles(directory='../server/cache/'), name='images')
app.mount('/', StaticFiles(directory='../client', html=True), name='index')
