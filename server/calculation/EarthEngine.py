from time import time
import ee
from loguru import logger
from Types import POI
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


    def _download_blob(self, bucket_name, source_blob_name, destination_file_name):
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(source_blob_name)
        blob.download_to_filename(destination_file_name)


    def download_images(self, scene_id: str, sensor, bands: list[str]):
        s = time()
        with open('./test.csv', 'r') as fr:
            lines = fr.readlines()
            for i in lines:
                line = i.split(',')
                if line[0] == scene_id:
                    google_cloud_path = line[-1][29:].strip()
                    scene = google_cloud_path.split('/')[-1].strip()
                    logger.success(f"{i=}")
                    logger.info(f"TIME: {time() - s}")
                    break
        logger.info(f"{google_cloud_path=}")
        logger.info(f"{scene=}")

        if sensor in ['LC08']:  # разные спутники Landsat
            for band in bands:
                    
                self._download_blob(
                    "gcp-public-data-landsat",
                    f"{google_cloud_path}/{scene}_{band}.TIF",
                    f'./{scene}_{band}.TIF'
                )
        else:
            logger.error(f"wrong sensor name {sensor}")
        return True

    def search_images(self, poi: POI, sensor: str = 'LC08'):
        ee.Initialize()
        point = ee.Geometry.Point(poi.coordinates.lon, poi.coordinates.lat)

        if poi.source == 'Landsat':
            images = ee.ImageCollection(f"LANDSAT/{sensor}/C02/T1_L2").filterBounds(point).filterDate(poi.date.start_date, poi.date.end_date)
        elif poi.source == 'Sentinel':
            images = ee.ImageCollection("COPERNICUS/S2_SR").filterBounds(point).filterDate(poi.date.start_date, poi.date.end_date)
        else:
            logger.error("wrong source")
        
        img_metadata = []
        for p in images.getInfo()['features']:
            del p["properties"]["system:footprint"]
            img_metadata.append(p["properties"])

        
        # google_scenes = pd.read_csv('https://storage.googleapis.com/gcp-public-data-landsat/index.csv.gz', compression='gzip')

        return img_metadata

