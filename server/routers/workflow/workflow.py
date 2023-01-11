
from fastapi import APIRouter, Depends
from loguru import logger
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder


from models import ClassificationTM
from models import DownloadSentinel
from models import DownloadLandsat
from models import ToastMessage
from models import ClipToMask
from models import KMeanOptions
from models import SearchPreviewTM
from models import SearchPreview
from models import PreviewTM
from models import AddLayerTM
from models import AddLayerOptions
from models import ShpSave
from models import ShpRead


from calculation.EarthEngine import EarthEngine
from calculation.FileHandler import FileHandler
from calculation.Classifier import Classifier



from auth import get_current_user


router = APIRouter(
    prefix='/workflow',
    dependencies=[Depends(get_current_user)]
    )






@router.post('/download-sentinel', response_model=ToastMessage)
async def download_sentinel(input: DownloadSentinel):
    
    return EarthEngine().download_sentinel(
        input.sentinel_meta,
        sensor=input.sensor,
        system_index=input.system_index,
        metadata=input.meta
        )


@router.post('/download-landsat', response_model=ToastMessage)
async def download_landsat(input: DownloadLandsat):
    
    return EarthEngine().download_landsat(
        input.landsat_meta,
        sensor=input.sensor,
        system_index=input.system_index,
        metadata=input.meta
        )


@router.post('/clip-to-mask', response_model=ToastMessage)
async def clip_to_mask(input: ClipToMask):
    return FileHandler().clip_to_mask(input.files, mask=input.mask)


@router.post('/stack-bands', response_model=ToastMessage)
async def stack_bands(files: list[str]):
    return FileHandler().stack_bands(files)


@router.post('/workflow/classification/k-mean', response_model=ClassificationTM)
async def classify_k_mean(options: KMeanOptions):
    return Classifier().k_mean(options.file_path, options.k)


@router.post('/search-preview', response_model=SearchPreviewTM)
async def search_preview(input: SearchPreview):
    return EarthEngine().search_preview(input.poi, input.date, input.sensor)


@router.get('/get-image-preview/{sensor}/{system_index}', response_model=PreviewTM)
async def get_image_preview(sensor: str, system_index: str):
    return EarthEngine().show_images_preview(sensor=sensor, system_index=system_index)


@router.get('/available-files/{to}')
def available_files(to: str):
    c = FileHandler().available_files(to)
    response = jsonable_encoder(c)
    return JSONResponse(content=response)


@router.get('/tree-available-files')
async def tree_available_files():
    return FileHandler().tree_available_files()


@router.post('/add-layer', response_model=AddLayerTM)
async def add_layer(input: AddLayerOptions):
    return FileHandler().add_layer(input.scope, input.satellite, input.product, input.target)


@router.post('/shp-save')
async def shp_save(input: ShpSave):
    FileHandler().shp_save(input.shp_name, input.layer)



@router.post('/shp-read')
def shp_read(input: ShpRead):
    logger.info(f"HELLO FROM SHP_READ!")
    return FileHandler().shp_read(input.shp_name)