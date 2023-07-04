
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, Security
from loguru import logger
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session
from time import sleep

from server.models import DownloadSentinel
from server.models import DownloadLandsat
from server.models import ToastMessage
from server.models import ClipToMask
from server.models import SearchPreviewTM
from server.models import SearchPreview
from server.models import PreviewTM
from server.models import AddLayerTM
from server.models import AddLayerOptions
from server.models import ShpSave
from server.models import ShpRead
from server.models import User1
from server.models import KMeanOptions
from server.models import StackOptions
from server.models import ClassificationTM


from humps import decamelize
from humps import camelize


from server.calculation.EarthEngine import EarthEngine
from server.calculation.FileHandler import FileHandler



from server.database import get_session
from server.auth import get_current_user
from .classification import classification

from server.sio import sio
import asyncio

from multiprocessing import Queue, Process

router = APIRouter(
    prefix='/workflow',
    )



@router.post('/search-preview', response_model=SearchPreviewTM)
async def search_preview(input: SearchPreview, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    return EarthEngine(user=user).search_preview(input.poi, input.date, input.sensor)


@router.get('/get-image-preview/{sensor}/{system_index}', response_model=PreviewTM)
async def get_image_preview(sensor: str, system_index: str, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    logger.debug(f"get_image_preview start!")
    r = EarthEngine(user=user).show_images_preview(sensor=sensor, system_index=system_index)
    logger.warning(f"{r=}")
    return r


@router.get('/available-files/{to}')
async def available_files(to: str, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    c = FileHandler(user=user).available_files(to)
    response = jsonable_encoder(c)
    return JSONResponse(content=response)


@router.get('/tree-available-files')
async def tree_available_files(user: User1 = Security(get_current_user, scopes=['regular_user'])):
    return FileHandler(user=user).tree_available_files()


@router.post('/add-layer', response_model=AddLayerTM)
async def add_layer(input: AddLayerOptions, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    return FileHandler(user=user).add_layer(input.scope, input.satellite, input.product, input.target)


@router.post('/shp-save')
async def shp_save(input: ShpSave, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    tm: ToastMessage = FileHandler(user=user).shp_save(input.shp_name, input.layer)
    return tm



@router.post('/shp-read')
def shp_read(input: ShpRead, user: User1 = Security(get_current_user, scopes=['regular_user'])):
    return FileHandler(user=user).shp_read(input.shp_name)




@sio.on('download-sentinel')
async def download_sentinel(sid, msg):
    data = DownloadSentinel.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = EarthEngine(user=session['user'])
    q = Queue()
    q.put(data)
    q.put('/miniGIS/workflow/Sentinel/')
    p = Process(target=alg.download_sentinel, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ToastMessage = q.get()["tm"]
    # print(result)
    await sio.emit("download-sentinel", result.json())



@sio.on('download-landsat')
async def download_landsat(sid, msg):
    data = DownloadLandsat.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = EarthEngine(user=session['user'])
    q = Queue()
    q.put(data)
    q.put('/miniGIS/workflow/Landsat/')
    p = Process(target=alg.download_landsat, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ToastMessage = q.get()["tm"]
    # print(result)
    await sio.emit("download-landsat", result.json())



@sio.on('clip-to-mask')
async def clip_to_mask(sid, msg):
    data = ClipToMask.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = FileHandler(user=session['user'])
    q = Queue()
    q.put(data)
    q.put('/miniGIS/workflow/') # '' for default yandex disk path
    p = Process(target=alg.clip_to_mask, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ToastMessage = q.get()["tm"]
    # print(result)
    await sio.emit("clip-to-mask", result.json())



@sio.on('stack-bands')
async def stack_bands(sid, msg):
    data = StackOptions.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = FileHandler(user=session['user'])
    q = Queue()
    q.put(data.files)
    q.put('/miniGIS/workflow/') # '' for default yandex disk path
    p = Process(target=alg.stack_bands, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ToastMessage = q.get()["tm"]
    # print(result)
    await sio.emit("stack-bands", result.json())

