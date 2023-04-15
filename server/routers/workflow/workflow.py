
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from loguru import logger
from datetime import datetime
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session

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

from server.calculation.classification.unsupervision.KMean import KMean
from server.calculation.classification.unsupervision.MeanShift import MeanShift
from server.calculation.classification.unsupervision.BisectingKMean import BisectingKMean
from server.calculation.classification.unsupervision.GaussianMixture import GaussianMixture

from server.models import BisectingKMeanOptions
from server.models import GaussianMixtureOptions
from server.models import MeanShiftOptions


from server.database import get_session
from server.auth import get_current_user
from server.auth import get_websocket_data
from .classification import classification


router = APIRouter(
    prefix='/workflow',
    )

# router.include_router(classification.router)




# @router.post('/download-sentinel', response_model=ToastMessage)
# async def download_sentinel(input: DownloadSentinel, user: User1 = Depends(get_current_user)):
#     return EarthEngine(user=user).download_sentinel(dwld_sentinel=input)


# @router.post('/download-landsat', response_model=ToastMessage)
# async def download_landsat(input: DownloadLandsat, user: User1 = Depends(get_current_user)):
#     return EarthEngine(user=user).download_landsat(landsat_meta=input)


# @router.post('/clip-to-mask', response_model=ToastMessage)
# async def clip_to_mask(input: ClipToMask, user: User1 = Depends(get_current_user)):
#     return FileHandler(user=user).clip_to_mask(data=input)


# @router.post('/stack-bands', response_model=ToastMessage)
# async def stack_bands(files: list[str], user: User1 = Depends(get_current_user)):
#     return FileHandler(user=user).stack_bands(files)




@router.post('/search-preview', response_model=SearchPreviewTM)
async def search_preview(input: SearchPreview, user: User1 = Depends(get_current_user)):
    return EarthEngine(user=user).search_preview(input.poi, input.date, input.sensor)


@router.get('/get-image-preview/{sensor}/{system_index}', response_model=PreviewTM)
async def get_image_preview(sensor: str, system_index: str, user: User1 = Depends(get_current_user)):
    return EarthEngine(user=user).show_images_preview(sensor=sensor, system_index=system_index)


@router.get('/available-files/{to}')
async def available_files(to: str, user: User1 = Depends(get_current_user)):
    c = FileHandler(user=user).available_files(to)
    response = jsonable_encoder(c)
    return JSONResponse(content=response)


@router.get('/tree-available-files')
async def tree_available_files(user: User1 = Depends(get_current_user)):
    return FileHandler(user=user).tree_available_files()


@router.post('/add-layer', response_model=AddLayerTM)
async def add_layer(input: AddLayerOptions, user: User1 = Depends(get_current_user)):
    return FileHandler(user=user).add_layer(input.scope, input.satellite, input.product, input.target)


@router.post('/shp-save')
async def shp_save(input: ShpSave, user: User1 = Depends(get_current_user)):
    FileHandler(user=user).shp_save(input.shp_name, input.layer)



@router.post('/shp-read')
def shp_read(input: ShpRead, user: User1 = Depends(get_current_user)):
    return FileHandler(user=user).shp_read(input.shp_name)





@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket,  session: Session = Depends(get_session)):
    # await websocket.accept()
    user = await get_websocket_data(token=websocket.cookies.get('access_token'), session=session)
    if user: await websocket.accept()
    try:
        while True:
            # data, user = await get_websocket_data(websocket=websocket, session=session)
            data = await websocket.receive_json()
            match decamelize(data)["operation"]:
                case 'download-sentinel':
                    data = DownloadSentinel.parse_obj(decamelize(data))
                    msg: ToastMessage = await EarthEngine(user=user).download_sentinel(dwld_sentinel=data)
                    await websocket.send_text(msg.json())
                case 'download-landsat':
                    data = DownloadLandsat.parse_obj(decamelize(data))
                    msg: ToastMessage = await EarthEngine(user=user).download_landsat(dwld_landsat=data)
                    await websocket.send_text(msg.json())
                case 'clip-to-mask':
                    data = ClipToMask.parse_obj(decamelize(data))
                    msg: ToastMessage = await FileHandler(user=user).clip_to_mask(data=data)
                    await websocket.send_text(msg.json())
                case 'stack-bands':
                    data = StackOptions.parse_obj(decamelize(data))
                    msg: ToastMessage = await FileHandler(user=user).stack_bands(files=data.files)
                    await websocket.send_text(msg.json())
                
                # unsupervised
                case '/classification/unsupervised/k-mean':
                    data = KMeanOptions.parse_obj(decamelize(data))
                    msg: ClassificationTM = await KMean(user, data.file_path).classify(data.k)
                    await websocket.send_text(msg.json())
                case '/classification/unsupervised/bisecting-kmean':
                    data = BisectingKMeanOptions.parse_obj(decamelize(data))
                    msg: ClassificationTM = await BisectingKMean(user, data.file_path).classify(data.k)
                    await websocket.send_text(msg.json())
                case '/classification/unsupervised/gaussian-mixture':
                    data = GaussianMixtureOptions.parse_obj(decamelize(data))
                    msg: ClassificationTM = await GaussianMixture(user, data.file_path).classify(data.n_components)
                    await websocket.send_text(msg.json())
                case '/classification/unsupervised/mean-shift':
                    data = MeanShiftOptions.parse_obj(decamelize(data))
                    msg: ClassificationTM = await MeanShift(user, data.file_path).classify(data.n_samples)
                    await websocket.send_text(msg.json())



    except WebSocketDisconnect:
        logger.info('\n\nWebSocketDisconnect ->', WebSocketDisconnect)
        await websocket.close()