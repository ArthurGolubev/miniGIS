import os

import socketio
from pathlib import Path
from loguru import logger
from datetime import timedelta
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm


from server.database import create_db_and_tables
from server.database import get_session
from server.auth import login_for_access_token
from server.auth import get_websocket_user

from server.routers import main




from server.models import Token
from server.sio import sio


Path('./cache').mkdir(exist_ok=True, parents=True)
app = FastAPI()

app_socketio = socketio.ASGIApp(socketio_server=sio, socketio_path='workflow')

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@sio.event
async def connect(sid, environ, auth):
    user = await get_websocket_user(token=auth["token"])
    await sio.save_session(sid, {'user': user})

@sio.event
async def message(_, msg):
    logger.success(f"Recieved the following message from the frontend: {msg}")
    await sio.emit("response", f"Responding from backend. Original message was: {msg}")

@sio.event
async def disconnect(sid):
    print('disconnect ', sid)


@app.post("/miniGISToken", response_model=Token)
async def login_for_access_token_from_api( body: OAuth2PasswordRequestForm = Depends(), session = Depends(get_session)):
    # Почему-то должен быть имено в корне проекта, через APIRouter не работает.
    # Скорее всего связано с OAuth2PasswordRequestForm
    # Оставил для возможности авторизироваться через форму на /docs
    # Для обычной авторизации с клиента сделал login_for_access_token_from_client в /routers/user/user
    return login_for_access_token(user=body, session=session)








app.mount(path="/sio", app=app_socketio)
app.include_router(main.router, prefix='/api/v2-rest')
app.mount('/cache', StaticFiles(directory='./cache/'), name='images')
app.mount('/', StaticFiles(directory='./client', html=True), name='index')
