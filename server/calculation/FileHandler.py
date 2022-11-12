import os
import geopandas as gpd
import rioxarray as rxr
import earthpy.spatial as es

from glob import glob
from pathlib import Path
from loguru import logger
from datetime import datetime
from shapely.geometry import Polygon
from Types import ToastMessage, GeoJSON




class FileHandler:

    def available_files(self) -> dict[str, dict[str, list[str]]]:
        """Возвращает список директорий и доступных в них файлов.

        Sentinel -> folder1 -> [band1.tif, band2.tif]
        Landsat -> (folder1, folder2 -> ([band1.tif, band2.tif, band3.tif]) ).
        """
        images_path = './images'
        available = {}
        folders_1 = glob( os.path.join(images_path, "*") ) 
        for folder_1 in folders_1:
            folders_2 = glob( os.path.join(folder_1, "*") )
            for folder_2 in folders_2:
                files = [f for f in glob( os.path.join(folder_2, "*") ) if os.path.isfile(f)]
                available[folder_1.split('/')[-1]] = {folder_2.split('/')[-1]: files}

        logger.info(f"{available=}")
        return available


    def clip_to_mask(self, band_path: str, mask: GeoJSON) -> ToastMessage:

        g = mask.geometry["coordinates"]
        d1 = {'col1': ['mask'], 'geometry': [Polygon(g[0])]}
        gdf = gpd.GeoDataFrame(d1, crs="EPSG:4326")
        band_crs = es.crs_check(band_path)
        mask = gdf.to_crs(band_crs)

        clipped = rxr.open_rasterio(band_path, masked=True).rio.clip(mask.geometry, from_disk=True).squeeze()

        path = band_path.split('/')
        clipped_folder = os.path.join(*path[:-1], 'clipped')
        file_format = path[-1][-3:]
        file_name = f"{path[-1][:-3]}_clipped.{file_format}"

        Path(clipped_folder).mkdir(parents=True, exist_ok=True)

        clipped.rio.to_raster(os.path.join(clipped_folder, file_name))
        
        return ToastMessage(
            header="Обрезка завершина - output.tif",
            message="Обрезка по маске завершина успешно",
            datetime=datetime.now()
        )

        