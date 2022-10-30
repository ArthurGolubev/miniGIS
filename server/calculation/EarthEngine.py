from time import time
import ee
from loguru import logger
from Types import Coordinates, Images, Period
from google.cloud import storage



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
        self.sentinel = []


    def _download_blob(self, bucket_name, source_blob_name, destination_file_name):
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_name)


    def download_images(self, images: list[Images]):
        s = time()
        logger.info('START_')
        for image in images:
            logger.warning(image)
            with open('./test.csv', 'r') as fr:
                lines = fr.readlines()
                for i in lines:
                    line = i.split(',')
                    if line[0] == image.scene_id:
                        google_cloud_path = line[-1][29:].strip()
                        scene = google_cloud_path.split('/')[-1].strip()
                        logger.success(f"{i=}")
                        logger.info(f"TIME: {time() - s}")
                        break

            # if image.sensor in ['LC08']:  # разные спутники Landsat
            #     for band in image.bands:
                        
            #         self._download_blob(
            #             "gcp-public-data-landsat",
            #             f"{google_cloud_path}/{scene}_{band}.TIF",
            #             f'./{scene}_{band}.TIF'
            #         )
            # else:
            #     logger.error(f"wrong sensor name {image.sensor}")
        return True

    def search_images(self, poi: Coordinates, date: Period,  sensor: str = 'LC08'):
        ee.Initialize()
        point = ee.Geometry.Point(poi.lon, poi.lat)

        if sensor in self.landsat:
            images = ee.ImageCollection(f"LANDSAT/{sensor}/C02/T1_L2").filterBounds(point).filterDate(date.start_date, date.end_date)
        elif sensor in self.sentinel:
            images = ee.ImageCollection("COPERNICUS/S2_SR").filterBounds(point).filterDate(date.start_date, date.end_date)
        else:
            logger.error("wrong source")
        
        img_metadata = []
        
        for p in images.getInfo()['features']:
            # p["properties"]["system:footprint"] = str(p["properties"]["system:footprint"])
            # del p["properties"]["system:footprint"]
            img_metadata.append(p["properties"])

        return img_metadata

    def show_images_preview(system_index: str):
        ee.Initialize()
        res = ee.Image(f'LANDSAT/LC08/C02/T1/{system_index}');
        parameters = {
            "min": 7000,
            "max": 16000,
            "dimensions": 2000,
            "bands": ['B4', "B3", "B2"]
        }
        # logger.info(f"{res.pixelLonLat().reproject('EPSG:32631').select(['longitude', 'latitude']).getInfo()=}")
        # for i in range(len(res.getInfo()["properties"]["system:footprint"]["coordinates"])):
        #     print(f'{i+1} - {res.getInfo()["properties"]["system:footprint"]["coordinates"][i]}')

        p = ee.Geometry.Polygon(res.getInfo()["properties"]["system:footprint"]["coordinates"])
        logger.info(f"{p.toGeoJSON()=}")
        return res.getThumbURL(parameters)
        # google_scenes = pd.read_csv('https://storage.googleapis.com/gcp-public-data-landsat/index.csv.gz', compression='gzip')


