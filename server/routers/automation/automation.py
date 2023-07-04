from loguru import logger
from server.sio import sio
from server.models import Algorithm
from sqlmodel import Session
from server.database import engine
from server.calculation.Automation import Automation
from fastapi import APIRouter
from fastapi import Depends, Security
from server.database import get_session
from sqlmodel import select
from server.models import ToastMessage
from datetime import datetime, timedelta
from server.models import User1

from server.models import SearchPreviewTM
from server.auth import get_current_user

router = APIRouter(prefix='/automation')

@router.post('/monitoring-start')
async def monitoring(
    *, session = Depends(get_session),
    # TODO включить проверку на пользователя, как только обновлю микросервис, который запрашивает этот обработчик
    # user = Security(get_current_user, scopes=['trigger_search_new_satellite_images'])
    ):
    algorithms: list[Algorithm] = session.exec(
        select(Algorithm)
        .where(Algorithm.start_date == None)
        .where(Algorithm.end_date == None)
        )

    for alg in algorithms:
        user = session.exec(select(User1).where(User1.id == alg.user_id)).first()
        a = Automation(user=user, alg=alg, alg_type='monitoring', session=session)
        msg: SearchPreviewTM =  a.search_new_image()
        if len(msg.images) > 0 and alg.last_file_name != msg.images[-1]["GRANULE_ID"]: 
        # if len(msg.images) > 0:
            logger.debug(f"new image!")
            a.download_new_image(image=msg.images[-1]) # prod
            a.clip_new_image()
            a.stack_new_image()
            result: ToastMessage = a.classificate_new_image()
            logger.success(f"{result=}")
            alg.last_file_name = msg.images[-1]["GRANULE_ID"]
            session.add(alg)
            session.commit()
            session.refresh(alg)
            logger.info(f"{alg=}")
        else:
            logger.debug(f"no new image!")
        



@sio.on('automation/monitoring')
async def save_automation_monitoring(sid, msg):
    session = await sio.get_session(sid)
    user = session['user']
    with Session(engine) as session:
        a = Automation(user=user, alg_type='monitoring', session=session)
        tm: ToastMessage = a.save_monitoring_algorithm_mask(msg=msg)
    await sio.emit("automation/monitoring", tm.json())




@sio.on('automation/data-processing')
async def automation_data_processing(sid, msg: Automation):
    logger.info(f"{msg=}")
    session = await sio.get_session(sid)
    user = session['user']
    with Session(engine) as session:
        a = Automation(user=user, alg_type='data-processing', session=session)
        tm: ToastMessage =  a.save_monitoring_algorithm_mask(msg=msg)
        await sio.emit("automation/monitoring", tm.json())
        msg: SearchPreviewTM =  a.search_new_image(period=True)
        iters = len(msg.images)
        for i, img in enumerate(msg.images):
            a.download_new_image(image=img) # prod
            a.clip_new_image()
            a.stack_new_image()
            result: ToastMessage = a.classificate_new_image()
            logger.success(f"{result=}")
            # await sio.emit("automation/data-processing", {
            #     "progress": {
            #             "iter": i+1,
            #             "iters": iters
            #         }
            # })

    await sio.emit("download-sentinel", "automation/data-processing")
