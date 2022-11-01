from time import time
import gzip
import ee
from loguru import logger
from Types import Coordinates, Images, Period
from google.cloud import storage
from pathlib import Path



def _time_benchmark(func):
    logger.error("OMG! IT'S TIME BENCHMARK")
    def wrapper():
        s = time()
        c = func()
        logger.success(f"time: {time() - s}")
        return c
    return wrapper

    

class EarthEngine:
    def __init__(self):
        self.benchmark = _time_benchmark
        self.landsat = ['LC08']
        self.sentinel = ['S2']



    def __ee_init(self):
        try:
            ee.Initialize()
        except:
            logger.error('some problem in __ee_init')
            ee.Authenticate()



    def _download_blob(self, bucket_name, source_blob_name, destination_file_name):
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_name)



    def download_images(self, images: list[Images]):
        s = time()
        logger.info('START_')
        for image in images:
            csv = "sentinel.csv.gz" if image.sensor == 'S2' else "landsat.csv.gz"
            with gzip.open(f'./{csv}', 'rt') as fr:
                lines = fr.readlines()
                google_cloud_path = None
                logger.info(f"{len(lines)=}")
                for i in lines:
                    line = i.split(',')
                    print(line[0], image.scene_id, line[0] == image.scene_id)
                    if line[0] == image.scene_id:
                        google_cloud_path = line[-1][29:].strip()
                        scene = google_cloud_path.split('/')[-1].strip()
                        logger.success(f"{i=}")
                        logger.info(f"TIME: {time() - s}")
                        break
                    
            if not google_cloud_path:
                logger.error(f"{image.scene_id} not in index.csv.gz")
                return False

            if image.sensor in ['LC08']:  # разные спутники Landsat
                Path(f"./{image.scene_id}").mkdir(parents=True, exist_ok=True)
                for band in image.bands:
                    self._download_blob(
                        "gcp-public-data-landsat",
                        f"{google_cloud_path}/{scene}_{band}.TIF",
                        f'./{image.scene_id}/{scene}_{band}.TIF'
                    )
            else:
                logger.error(f"wrong sensor name {image.sensor}")
        return True



    def search_images(self, poi: Coordinates, date: Period,  sensor: str = 'LC08'):
        self.__ee_init()
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
        return img_metadata



    def show_images_preview(self, system_index: str, sensor: str):
        logger.info("show_images_preview")
        self.__ee_init()
        if sensor in self.landsat:
            res = ee.Image(f'LANDSAT/LC08/C02/T1/{system_index}')
            parameters = {
                "min": 0,
                "max": 3000,
                "dimensions": 2000,
                "bands": ['B4', "B3", "B2"],
                # "gamma": [0.95, 1.1, 1]
            }
        elif sensor in self.sentinel:
            res = ee.Image(f'COPERNICUS/S2_HARMONIZED/{system_index}')
            logger.info(f"{res.getInfo()}=")
            parameters = {
                "min": 0,
                "max": 3000,
                "dimensions": 2000,
                "bands": ['B4', "B3", "B2"]
            }
        else:
            logger.error(f"wrong sensor {sensor=}")

        p = ee.Geometry.Polygon(res.getInfo()["properties"]["system:footprint"]["coordinates"])
        logger.info(f"{p.toGeoJSON()=}")
        return res.getThumbURL(parameters)



    def sentinelCSV(self):
        logger.info("START CSV")
        with gzip.open('./sentinel.csv.gz', 'rt') as fr:
            line1 = fr.readline().split(',')
            logger.info(f"{line1=}")
            line2 = fr.readline().split(',')
            logger.info(f"{line2=}")

            for header, attr in zip(line1, line2):
                logger.info(f"{header} - {attr}")
            # for count, _ in enumerate(fr):
            #     pass
        mgrs_tile = line2[3]
        logger.success(mgrs_tile)
        UTM_ZONE        = mgrs_tile[:2]
        LATITUDE_BAND   = mgrs_tile[2:3]
        GRID_SQUARE     = mgrs_tile[3:]
        PRODUCT_ID      = "S2B_MSIL1C_20200324T032539_N0209_R018_T48PVC_20200324T074418.SAFE"
        GRANULE_ID      = "L1C_T48PVC_A015917_20200324T034315"
        LAYER           = f"T{mgrs_tile}_{PRODUCT_ID[11:26]}_B03.jp2"

        logger.warning(f"{UTM_ZONE=}")
        logger.warning(f"{LATITUDE_BAND=}")
        logger.warning(f"{GRID_SQUARE=}")
        logger.warning(f"{LAYER=}")

        self._download_blob(
            "gcp-public-data-sentinel-2",
            f"tiles/{UTM_ZONE}/{LATITUDE_BAND}/{GRID_SQUARE}/{PRODUCT_ID}/GRANULE/{GRANULE_ID}/IMG_DATA/{LAYER}",
            f'./{LAYER}'
        )
        logger.info("END CSV")
        return True

