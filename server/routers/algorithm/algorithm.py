import os
from fastapi.routing import APIRouter
from fastapi import Depends
from loguru import logger
from sqlmodel import Session, select

from server.models import User1
from server.models import Algorithm
from server.calculation.FileHandler import FileHandler

from server.auth import get_current_user
from server.auth import get_websocket_user
from server.database import get_session
from server.sio import sio



router = APIRouter(prefix='/algorithm')


@router.get('/all', response_model=list[Algorithm])
async def user_algorithms(user: User1 = Depends(get_current_user), session: Session = Depends(get_session)):
    algorithms = session.exec(select(Algorithm).where(Algorithm.user_id == user.id)).all()
    yandex = FileHandler(user=user).get_algorithms_yandex()
    algorithms = tuple(filter(lambda e: e.name in yandex, algorithms))
    logger.warning(f"{algorithms=}")
    # TODO Сделать возвращение объекта, который включает те, которые есть и отдельным списком те, которых уже нет в папке, но есть в БД
    # for i, algorithm in enumerate(algorithms):
    #     logger.info(f'{i+1} - {algorithm=}')
    return algorithms


@router.get('/detail/{alg_id}', response_model=Algorithm)
async def get_alg_info(alg_id, session: Session = Depends(get_session), user: User1 = Depends(get_current_user)):
    response = session.exec(select(Algorithm).where(Algorithm.id == alg_id).where(Algorithm.user_id == user.id)).first()
    
    alg_path = os.path.join(*response.mask.split('/')[:-2])
    alg_type = 'monitoring' if response.start_date == None and response.end_date == None else 'archive date'
    FileHandler(user=user).algorithm_results(alg_path=alg_path, alg_type=alg_type)
    logger.info(f"\n\n\n\n\n/detail/{alg_id}\n\n\n")


    return response



@sio.on('algorithm/timeline')
async def get_images(sid, msg):
    sio_session = await sio.get_session(sid)
    user = sio_session['user']
    await FileHandler(user=user).get_products_by_path(msg["path"], sio)