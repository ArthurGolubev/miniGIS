from time import time
import ee
from loguru import logger
from Types import POI



class EarthEngine:
    def __init__(self):
        pass

    def _time_benchmark(func):
        def wrapper(self, *args, **kwargs):
            s = time()
            func(self, *args, **kwargs)
            logger.success(f"time: {time() - s}")
        return wrapper


    # @_time_benchmark
    def poi_images(self, poi: POI):
        ee.Initialize()
        point = ee.Geometry.Point(poi.coordinates.lon, poi.coordinates.lat)
        if poi.source == 'Landsat':
            images = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(point).filterDate(poi.date.start_date, poi.date.end_date)
        elif poi.source == 'Sentinel':
            images = ee.ImageCollection("COPERNICUS/S2_SR").filterBounds(point).filterDate(poi.date.start_date, poi.date.end_date)
        else:
            logger.error("wrong source")

        # logger.info(images.first().getInfo())
        logger.info(images.size().getInfo())
        logger.info(images.first().get('CLOUD_COVER').getInfo())
        logger.info(images.first().get('DATE_ACQUIRED').getInfo())
        logger.info(images.first().get('LANDSAT_SCENE_ID').getInfo())
        logger.info(images.first().bandNames().getInfo())

        n_images = images.size().getInfo()
        list_images = images.toList(n_images)
        list_images = [ee.Image(list_images.get(x)).get('LANDSAT_SCENE_ID').getInfo() for x in range(n_images)]

        # logger.success(f"{images.toDictionary()=}")
        # logger.success(f"{ee.Image(li.get(0)).get('LANDSAT_SCENE_ID').getInfo()=}")
        logger.success(f"{list_images=}")
        return list_images



    def earth_engine():
        # ee.Authenticate()
        ee.Initialize()
        lat = 39.444012
        lon = -121.833619
        poi = ee.Geometry.Point(lon, lat)

        start_date = '2018-10-01'
        end_date = '2019-01-31'
        landsat = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(poi).filterDate(start_date, end_date)
        logger.info(landsat.size().getInfo())
        # logger.info(landsat.first().getInfo())
        logger.info(landsat.first().get('CLOUD_COVER').getInfo())
        logger.info(landsat.first().get('DATE_ACQUIRED').getInfo())
        logger.info(landsat.first().bandNames().getInfo())

        # landsat_list = landsat.toList(landsat.size())

        # parameters = {
        #     "min": 7000,
        #     "max": 16000,
        #     "dimensions": 800,
        #     "bands": ["SR_B4", "SR_B3", "SR_B2"]
        # }