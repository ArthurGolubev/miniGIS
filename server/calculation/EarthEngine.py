import gzip
import ee
from time import time
from datetime import datetime, timedelta
from loguru import logger
from Types import Coordinates, LandsatDownload, Period, SentinelDownload, ToastMessage, SearchImagesTM, PreviewTM
from google.cloud import storage
from pathlib import Path



def time_metr(func):
    logger.info(f"Старт {func.__name__}")
    start = time()
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    logger.info(f"{func.__name__} -> Вермя выполнения: {timedelta(seconds=time()-start)} секунд")
    return wrapper



class EarthEngine:
    def __init__(self):
        self.landsat = ['LC08']
        self.sentinel = ['S2']
        try:
            ee.Initialize()
        except:
            logger.error('some problem in __ee_init')
            ee.Authenticate()
            ee.Initialize()



    def _download_blob(self, bucket_name, source_blob_name, destination_file_name):
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_name)



    @time_metr
    def search_images(self, poi: Coordinates, date: Period,  sensor: str = 'LC08') -> SearchImagesTM:
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
        return SearchImagesTM(
            images=img_metadata,
            header='Поиск снимков',
            message=f'Найдено {len(img_metadata)} снимков',
            datetime=datetime.today()
        )



    @time_metr
    def show_images_preview(self, system_index: str, sensor: str) -> PreviewTM:
        logger.debug(__name__)
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
            header='Запрос привью',
            message=f'Сцена {system_index}',
            datetime=datetime.today()
        )



    @time_metr
    def download_sentinel(self, sentinel_meta: SentinelDownload, preview_url: str, metadata: str) -> ToastMessage:
        UTM_ZONE        = sentinel_meta.mgrs_tile[:2]
        LATITUDE_BAND   = sentinel_meta.mgrs_tile[2:3]
        GRID_SQUARE     = sentinel_meta.mgrs_tile[3:]
        PRODUCT_ID      = sentinel_meta.product_id + '.SAFE'
        GRANULE_ID      = sentinel_meta.granule_id
        bands           = sentinel_meta.bands

        Path(f"./images/raw/Sentinel/{PRODUCT_ID}/").mkdir(parents=True, exist_ok=True)
        for band in bands:
            LAYER = f"T{sentinel_meta.mgrs_tile}_{PRODUCT_ID[11:26]}_{band}.jp2"
            logger.info(f"{UTM_ZONE}/{LATITUDE_BAND}/{GRID_SQUARE}/{PRODUCT_ID}/GRANULE/{GRANULE_ID}/IMG_DATA/{LAYER}")
            self._download_blob(
                "gcp-public-data-sentinel-2",
                f"tiles/{UTM_ZONE}/{LATITUDE_BAND}/{GRID_SQUARE}/{PRODUCT_ID}/GRANULE/{GRANULE_ID}/IMG_DATA/{LAYER}",
                f'./images/raw/Sentinel/{PRODUCT_ID}/{LAYER}'
            )

        with open(f'./images/raw/Sentinel/{PRODUCT_ID}/preview.txt', 'w') as preview:
            preview.write(preview_url + '\n')
            preview.write(metadata)
        return ToastMessage(
            header=f'Загрузка завершина - Sentinel',
            message=f"""
                Продукт {PRODUCT_ID},
                Скачены слои {bands}
            """,
            datetime=datetime.now()
        )



    @time_metr
    def download_landsat(self, landsat_download: LandsatDownload, preview_url: str, metadata: str) -> ToastMessage:
        SENSOR_ID           = landsat_download.sensor_id
        PATH                = landsat_download.path.zfill(3)
        ROW                 = landsat_download.row.zfill(3)
        bands               = landsat_download.bands
        PRODUCT_ID          = landsat_download.product_id

        Path(f"./images/raw/Landsat/{PRODUCT_ID}/").mkdir(parents=True, exist_ok=True)
        for band in bands:
            PRODUCT_ID_BAND = f"{PRODUCT_ID}_{band}.TIF"
            logger.info(f"START_LANDSAT\n{SENSOR_ID}/01/{PATH}/{ROW}/{PRODUCT_ID}/{PRODUCT_ID_BAND}")
            self._download_blob(
                "gcp-public-data-landsat",
                f"{SENSOR_ID}/01/{PATH}/{ROW}/{PRODUCT_ID}/{PRODUCT_ID_BAND}",
                f'./images/raw/Landsat/{PRODUCT_ID}/{PRODUCT_ID_BAND}'
            )
        with open(f'./images/raw/Landsat/{PRODUCT_ID}/preview.txt', 'w') as preview:
            preview.write(preview_url + '\n')
            preview.write(metadata)
        return ToastMessage(
            header=f'Загрузка завершина - Landsat',
            message=f"""
                Продукт {PRODUCT_ID},
                Скачены слои {bands}
            """,
            datetime=datetime.now()
        )



    def test_data(self):
        granule_ids = {}
        err = []
        with gzip.open('sentinel.csv.gz', 'rt') as f:
            headers = f.readline().split(',')
            logger.debug(headers)
            for _ in range(500000):
                row = f.readline().split(',')
                # for k, v in zip(headers, row):
                #     logger.info(f"{k} - {v}")
                d = granule_ids.get(row[0]+row[1], None)
                if d:
                    err.append(d)
                    err.append(row)
                else:
                    granule_ids[row[0]+row[1]] = row

        for e1 in sorted(err):
            logger.info(f"{e1[1]}")
            # for v1, v2, h in zip(e1, e2, headers):
            #     logger.success(f"{v1==v2} {h}")
            #     logger.info(f"{v1=} - {v2=}")
            # print()