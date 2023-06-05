import os
import rasterio


from io import StringIO
from json import dumps

from skimage.io import imsave
from pathlib import Path
from loguru import logger

from rasterio.plot import reshape_as_image, reshape_as_raster
from matplotlib.pyplot import imread
from matplotlib.pyplot import imsave as matplotlib_imsave
from matplotlib import colormaps
from pyproj import Transformer


from server.calculation.YandexDiskHadler import YandexDiskHandler
from server.calculation.FileHandler import FileHandler







class ImgHandler(YandexDiskHandler):
    
    def __init__(self, user, file_path: str, alg_name: str, alg_param: str) -> None:
        super().__init__(user=user)
        self.user = user
        self.file_path = file_path
        self.alg_name = alg_name
        self.alg_param = alg_param



    def open_(self):
        # TODO можно сделать через ByteIO (не скачивать в директорию)
        temp_file_stack = f'./cache/temp_username_{self.file_path.split("/")[-1]}'
        self.y.download(self.file_path, temp_file_stack)

        with rasterio.open(temp_file_stack) as img:
            self.meta = img.meta
            origin_count = self.meta["count"]
            self.meta.update(driver="GTiff")
            self.meta.update(count=1)
            self.meta.update(compress='lzw')

            # rasterio format (bands, rows, columns) -> scikit-image (rows, columns, bands)
            reshaped_img = reshape_as_image(img.read())
        # reshaped_img = reshaped_img.reshape(-1, origin_count)
            # Flatten the raster array (решейпит из многомерного масив в одномерный масив, как я понял)
            # [[1, 23, 40], [1, 2, 33, 12]] -> [1, 23, 40, 1, 2, 33, 12]
            # reshaped_img = img.read().reshape(-1, origin_count)
            reshaped_img = reshaped_img.reshape(-1, origin_count)
        logger.info(f"{img=}")
        rows, cols = img.shape
        logger.info(f"{img.shape=}")
        logger.success('success1!')
        return rows, cols, reshaped_img



    def save_(self, predictions_2d, statistic, path: str):
        path = self.file_path.split('/')
        SATELLITE = path[-3]
        PRODUCT = path[-2]





        # GTiff img
        file_name = f"{self.alg_name}_{path[-1].split('.')[-2]}_{self.alg_param}.tif"
        cached_file_name = f"cached_{self.user.username}_" + file_name
        classification_folder = os.path.join('./cache', 'classification', SATELLITE, PRODUCT)
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        logger.info(f'{classification_folder=}')
        self.file_path = os.path.join(classification_folder, cached_file_name)

        with rasterio.open(self.file_path, "w", **self.meta) as dst:
            dst.write(predictions_2d)
            bounds = dst.bounds
            crs = dst.crs


            # dst.write_colormap(
            #     1,
            #     {
            #         0: (255, 0, 0, 255),
            #         1: (152, 208, 98, 255),
            #         2: (152, 208, 0, 255),
            #         3: (102, 208, 30, 255),
            #         9: (0, 0, 255, 255)
            #     }
            # )


        if path == '':
            # вариант вызываемый из workflow
            yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}'
        else:
            # в случае вызова из автоматизации
            yandex_disk_path = "/".join(path[:-2]) + '/classification'


        # yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}'
        self._make_yandex_dir_recursively(yandex_disk_path)
        self.y.upload(self.file_path, yandex_disk_path + f'/{file_name}', overwrite=True)

        logger.warning('STEP 1')




        # img to show in browser
        transformer = Transformer.from_crs(crs, 4326, always_xy=True)
        left_bottom = transformer.transform(bounds[0], bounds[1])
        right_top = transformer.transform(bounds[2], bounds[3])

        statistic["bounds"] = [left_bottom, right_top]
        metafile = StringIO(dumps(statistic))
        file_name = f"{self.alg_name}_{path[-1].split('.')[-2]}_{self.alg_param}"
        cached_file_name = f"cached_{self.user.username}_" + file_name + '.png'
        classification_folder = os.path.join('./cache', 'classification', SATELLITE, PRODUCT, 'show_in_browser')
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        self.file_path = os.path.join(classification_folder, cached_file_name)
        imsave(fname=self.file_path, arr=reshape_as_image(predictions_2d))

        # добавляем палитру для классифицированного изображения
        img = imread(fname=self.file_path)
        matplotlib_imsave(fname=self.file_path, arr=img, cmap=colormaps["turbo"], format='png')
        
        if path == '':
            # вариант вызываемый из workflow
            yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}/show_in_browser'
        else:
            # в случае вызова из автоматизации
            yandex_disk_path = "/".join(path[:-2]) + '/classification/show_in_browser'


        # yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}/show_in_browser'
        self._make_yandex_dir_recursively(yandex_disk_path)
        self.y.upload(metafile, yandex_disk_path + f'/{file_name}.metafile', overwrite=True)
        self.y.upload(self.file_path, yandex_disk_path + f'/{file_name}.png', overwrite=True)
        logger.success('success2!')

        classification_layer = FileHandler(user=self.user).get_classification_layer(
            satellite=SATELLITE, product=PRODUCT, target=file_name, username=self.user.username
            )
        logger.warning(f'STEP 1\n{classification_layer=}')


        return classification_layer
