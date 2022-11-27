import os
import rasterio
import geopandas as gpd
import rioxarray as rxr
import earthpy.spatial as es

from json import dumps
from glob import glob
from pathlib import Path
from loguru import logger
from datetime import datetime
from shapely.geometry import Polygon
from Types import ToastMessage, GeoJSON
from Types import AddLayerTM
from pyproj import Transformer




class FileHandler:

    def stack_bands(self, files: list[str]) -> ToastMessage:
        bands = sorted(files)
        src = rasterio.open(bands[0])
        meta = src.meta
        logger.info(f"{meta=}")
        meta.update(count=len(bands))
        meta.update(driver="GTiff")

        # Создаём композитное изображение
        path = bands[0].split('/')
        stack_folder = os.path.join(*path[:-4], 'stack', *path[-3:-2], *path[-2:-1])
        file_format = path[-1][-3:]
        bands_names = [band.split('/')[-1][:-4].split('_')[-1] for band in bands]
        file_name = f"stack_{'_'.join(bands_names)}_{'_'.join(path[-1][:-4].split('_')[:-1])}.tif"

        logger.info(f"{bands_names=}")
        logger.info(f"{file_format=}")
        logger.info(f"{file_name=}")
        logger.info(f"{stack_folder=}")

        Path(stack_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(stack_folder, file_name)

        with rasterio.open(file_path, "w", **meta) as dst:
            for id, layer in enumerate(bands, start=1):
                with rasterio.open(layer) as src:
                    dst.write_band(id, src.read(1))

        return ToastMessage(
            header="Объединение слоёв",
            message=f"слои {bands} объеденены в {file_name}",
            datetime=datetime.now()
            )



    def tree_available_files(self):
        # start = './images'
        # l1 = glob(os.path.join(start, "*"))
        # result = {}
        # for dirs1 in l1:
        #     l2 = glob(os.path.join(dirs1, "*"))
        #     for dirs2 in l2:
        #         l3 = glob(os.path.join(dirs2, "*"))
        #         k = dirs2.split('/')[-1]
        #         logger.info(f"{k=}")
        #         result[dirs1.split('/')[-1]] = {k: [x.split('/')[-1] for x in l3]}
        raw = {}
        classification = {}
        for sattelite in glob(os.path.join('./images/classification', "*")):
            s = sattelite.split('/')[-1]
            classification[s] = {}
            for product in glob(os.path.join(sattelite, "*")):
                p = product.split('/')[-1]
                classification[s][p] = [x.split('/')[-1] for x in glob(os.path.join(product, "*")) if os.path.isfile(x)]
        for sattelite in glob(os.path.join('./images/raw', "*")):
            s = sattelite.split('/')[-1]
            raw[s] = {}
            for product in glob(os.path.join(sattelite, "*")):
                p = product.split('/')[-1]
                raw[s][p] = None

        return {
            "raw": raw,
            "classification": classification
        }





    def add_layer(self, scope, satellite, product, target) -> AddLayerTM:
        p = os.path.join('./images', scope, satellite, product)
        if scope == 'raw':
            with open(os.path.join(p, 'preview.txt'), 'r') as f:
                img_url=f.readline()
                metadata=f.readline()
        elif scope == 'classification':
            res = self.get_classification_layer(p + f'/{target}')
            logger.info(f"{res=}")
            img_url=res["imgUrl"]
            metadata=dumps(res["metadata"])
        return AddLayerTM(
            header='Добавлен слой',
            message=f'',
            datetime=datetime.now(),
            img_url=img_url,
            metadata=metadata
        )
    




    def available_files(self, to: str) -> dict[str, dict[str, list[str]]]:
        """Возвращает список директорий и доступных в них файлов.

        Sentinel -> folder1 -> [band1.tif, band2.tif]
        Landsat -> (folder1, folder2 -> ([band1.tif, band2.tif, band3.tif]) ).
        """
        images_path = {
            "Clip": './images/raw',
            "Stack": './images/clipped',
            "Classification": './images/stack',
            "View": "./images/classification/"
        }
        available = {}
        folders_1 = glob( os.path.join(images_path[to], "*") ) 
        for folder_1 in folders_1:
            folders_2 = glob( os.path.join(folder_1, "*") )
            logger.info(f"{folders_2=}")
            product = {}
            for folder_2 in folders_2:
                files = [f for f in glob( os.path.join(folder_2, "*") ) if os.path.isfile(f)]
                logger.debug(f"{files=}")
                if to == 'Classification' or to == 'View':
                    layers = {k: v for k, v in [(path.split('/')[-1], path) for path in files]}
                else:
                    layers = {k: v for k, v in [(path.split('.')[-2].split('_')[-1], path) for path in files]}
                product[folder_2.split('/')[-1]] =  layers
            available[folder_1.split('/')[-1]] = product
        logger.info(f"{available=}")
        return available




    def clip_to_mask(self, files: str, mask: list[GeoJSON]) -> ToastMessage:
        g = mask[0].geometry["coordinates"]
        d1 = {'col1': ['mask'], 'geometry': [Polygon(g[0])]}
        gdf = gpd.GeoDataFrame(d1, crs="EPSG:4326")
        # gdf = gpd.GeoDataFrame(d1, crs="EPSG:32630")
        for band_path in files:
            band_crs = es.crs_check(band_path)
            mask[0] = gdf.to_crs(band_crs)
            clipped = rxr.open_rasterio(band_path, masked=True).rio.clip(mask[0].geometry, from_disk=True).squeeze()

            path = band_path.split('/')
            clipped_folder = os.path.join(*path[:-4], 'clipped', *path[-3:-2], *path[-2:-1])
            file_format = path[-1][-3:]
            file_name = f"clipped_{path[-1][:-4]}.{file_format}"
            logger.info(f"{file_name=}")
            Path(clipped_folder).mkdir(parents=True, exist_ok=True)
            
            clipped.rio.to_raster(os.path.join(clipped_folder, file_name))

        return ToastMessage(
            header="Обрезка завершина - output.tif",
            message="Обрезка по маске завершина успешно",
            datetime=datetime.now()
        )




    def get_classification_layer(self, file_path):
        logger.info(f"{file_path=}")
        with rasterio.open(file_path) as f:
            bounds = f.bounds

        transformer = Transformer.from_crs(32630, 4326, always_xy=True)
        left_bottom = transformer.transform(bounds[0], bounds[1])
        right_top = transformer.transform(bounds[2], bounds[3])

        file_path = file_path.split('/')
        path = os.path.join(*file_path[:-1], 'show_in_browser')
        # path = os.path.join(file_path, 'show_in_browser')
        file_name = file_path[-1].split('.')[0] + ".png"
        file_path = os.path.join(path, file_name)

        return {
            "fileName": file_name,
            "imgUrl": file_path,
            "metadata": {
                "system:footprint": {
                    "coordinates": [left_bottom, right_top]
                }
            }
            }
