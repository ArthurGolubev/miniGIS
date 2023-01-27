import os
import ee

from time import time
from io import BytesIO
from loguru import logger
from google.cloud import storage
from datetime import datetime, timedelta

from server.calculation.YandexDiskHadler import YandexDiskHandler
from server.models import Coordinates, DownloadLandsat, Period, DownloadSentinel, ToastMessage, SearchPreviewTM, PreviewTM


def time_metr(func):
    logger.info(f"Старт {func.__name__}")
    start = time()
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    logger.info(f"{func.__name__} -> Вермя выполнения: {timedelta(seconds=time()-start)} секунд")
    return wrapper



class EarthEngine(YandexDiskHandler):
    def __init__(self, user):
        self.landsat = ['LC08']
        self.sentinel = ['S2']
        super().__init__(user=user)
        
        ee_creds = ee.ServiceAccountCredentials(
            email=os.getenv("MINIGIS_EARTH_ENGINE_SERVICE_ACCOUNT_EMAIL"),
            key_file='/miniGIS/credential/MINIGIS_EARTH_ENGINE_KEY_DATA'
        )
        ee.Initialize(ee_creds)



    def _download_blob(self, bucket_name, source_blob_name):
        storage_client = storage.Client(project='minigis-375110')
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)
        return BytesIO(blob.download_as_string())



    @time_metr
    def search_preview(self, poi: Coordinates, date: Period,  sensor: str = 'LC08') -> SearchPreviewTM:
        point = ee.Geometry.Point(poi.lon, poi.lat)

        if sensor in self.landsat:
            images = ee.ImageCollection(f"LANDSAT/{sensor}/C01/T1").filterBounds(point).filterDate(date.start_date, date.end_date)
        elif sensor in self.sentinel:
            images = ee.ImageCollection("COPERNICUS/S2_HARMONIZED").filterBounds(point).filterDate(date.start_date, date.end_date)
        else:
            logger.error("wrong source")
        
        img_metadata = []
        for p in images.getInfo()['features']:
            img_metadata.append(p["properties"])
        return SearchPreviewTM(
            images=img_metadata,
            header='Поиск снимков',
            message=f'Найдено {len(img_metadata)} снимков',
            datetime=datetime.today()
        )



    @time_metr
    def show_images_preview(self, sensor: str, system_index: str) -> PreviewTM:
        logger.debug(__name__)
        sensor = sensor.strip('\n')
        system_index = system_index.strip('\n')
        if sensor in self.landsat:
            res = ee.Image(f'LANDSAT/LC08/C01/T1/{system_index}')
            parameters = {
                "min": 5000,
                "max": 12000,
                "dimensions": 2000,
                "bands": ['B4', "B3", "B2"],
            }
        elif sensor in self.sentinel:
            res = ee.Image(f'COPERNICUS/S2_HARMONIZED/{system_index}')
            parameters = {
                "min": 0,
                "max": 3000,
                "dimensions": 2000,
                "bands": ['B4', "B3", "B2"]
            }
        else:
            logger.error(f"wrong sensor {sensor=}")

        return PreviewTM(
            img_url=res.getThumbURL(parameters),
            system_index=system_index,
            sensor=sensor,
            header='Запрос привью',
            message=f'Сцена {system_index}',
            datetime=datetime.today()
        )



    @time_metr
    def download_sentinel(self, dwld_sentinel: DownloadSentinel) -> ToastMessage:
        UTM_ZONE        = dwld_sentinel.sentinel_meta.mgrs_tile[:2]
        LATITUDE_BAND   = dwld_sentinel.sentinel_meta.mgrs_tile[2:3]
        GRID_SQUARE     = dwld_sentinel.sentinel_meta.mgrs_tile[3:]
        PRODUCT_ID      = dwld_sentinel.sentinel_meta.product_id + '.SAFE'
        GRANULE_ID      = dwld_sentinel.sentinel_meta.granule_id
        bands           = dwld_sentinel.sentinel_meta.bands
        sensor          = dwld_sentinel.sensor
        system_index    = dwld_sentinel.system_index
        metadata        = dwld_sentinel.metadata

        yandex_disk_path = f'/miniGIS/images/raw/Sentinel/{PRODUCT_ID}'
        self._make_yandex_dir_recursively(yandex_disk_path)
        for band in bands:
            LAYER = f"T{dwld_sentinel.sentinel_meta.mgrs_tile}_{PRODUCT_ID[11:26]}_{band}.jp2"
            file_io = self._download_blob(
                "gcp-public-data-sentinel-2",
                f"tiles/{UTM_ZONE}/{LATITUDE_BAND}/{GRID_SQUARE}/{PRODUCT_ID}/GRANULE/{GRANULE_ID}/IMG_DATA/{LAYER}",
            )
            self.y.upload(file_io, yandex_disk_path + f'/{LAYER}', overwrite=True)

        with BytesIO() as preview:
            preview.write(bytes(sensor + '\n', 'utf-8'))
            preview.write(bytes(system_index + '\n', 'utf-8'))
            preview.write(bytes(metadata, 'utf-8'))
            preview.seek(0)
            self.y.upload(preview, yandex_disk_path + '/preview.txt', overwrite=True)

        return ToastMessage(
            header=f'Загрузка завершена - Sentinel',
            message=f"""
                Продукт {PRODUCT_ID},
                Cлои {bands}
            """,
            datetime=datetime.now()
        )



    @time_metr
    def download_landsat(self, dwld_sentinel: DownloadLandsat) -> ToastMessage:
        SENSOR_ID           = dwld_sentinel.landsat_meta.sensor_id
        PATH                = dwld_sentinel.landsat_meta.path.zfill(3)
        ROW                 = dwld_sentinel.landsat_meta.row.zfill(3)
        bands               = dwld_sentinel.landsat_meta.bands
        PRODUCT_ID          = dwld_sentinel.landsat_meta.product_id
        sensor              = dwld_sentinel.sensor
        system_index        = dwld_sentinel.system_index
        metadata            = dwld_sentinel.metadata

        yandex_disk_path = f'/miniGIS/images/raw/Landsat/{PRODUCT_ID}'
        self._make_yandex_dir_recursively(yandex_disk_path)
        for band in bands:
            PRODUCT_ID_BAND = f"{PRODUCT_ID}_{band}.TIF"
            file_io = self._download_blob(
                "gcp-public-data-landsat",
                f"{SENSOR_ID}/01/{PATH}/{ROW}/{PRODUCT_ID}/{PRODUCT_ID_BAND}",
            )
            self.y.upload(file_io, yandex_disk_path + f'/{PRODUCT_ID_BAND}', overwrite=True)
        
        with BytesIO() as preview:
            preview.write(bytes(sensor + '\n', 'utf-8'))
            preview.write(bytes(system_index + '\n', 'utf-8'))
            preview.write(bytes(metadata, 'utf-8'))
            preview.seek(0)
            self.y.upload(preview, yandex_disk_path + '/preview.txt', overwrite=True)

        return ToastMessage(
            header=f'Загрузка завершена - Landsat',
            message=f"""
                Продукт {PRODUCT_ID},
                Слои {bands}
            """,
            datetime=datetime.now()
        )
