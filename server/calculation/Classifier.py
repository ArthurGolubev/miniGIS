import rasterio
from glob import glob
import os
from loguru import logger
from sklearn import cluster
from rasterio.plot import reshape_as_image, reshape_as_raster
from skimage.io import imsave
from models import ClassificationTM
from datetime import datetime
from pathlib import Path
from .FileHandler import FileHandler
from matplotlib.pyplot import imread
from matplotlib.pyplot import imsave as matplotlib_imsave
from matplotlib import colormaps
from .YandexDiskHadler import YandexDiskHandler




class Classifier(YandexDiskHandler):
    def __init__(self, user) -> None:
        super().__init__(user=user)

    def k_mean(self, file_path: str, k: int) -> ClassificationTM:
        logger.info(f'{file_path=}')

        temp_file_stack = f'./cache/temp_username_{file_path.split("/")[-1]}'
        self.y.download(file_path, temp_file_stack)

        with rasterio.open(temp_file_stack) as img:
            meta = img.meta
            origin_count = meta["count"]
            meta.update(driver="GTiff")
            # meta.update(driver="PNG")
            meta.update(count=1)
            meta.update(compress='lzw')

            reshaped_img = reshape_as_image(img.read())
        reshaped_img = reshaped_img.reshape(-1, origin_count)
        rows, cols = img.shape
        logger.success('success1!')
        kmeans_predictions = cluster.KMeans(n_clusters=k, random_state=0).fit(reshaped_img.reshape(-1, origin_count))
        kmeans_predictions_2d = kmeans_predictions.labels_.reshape(1, rows, cols)
        # logger.info(f"{kmeans_predictions.labels_=}")
        # logger.info(f"{kmeans_predictions_2d.shape=}")

        path = file_path.split('/')
        SATELLITE = path[-3]
        PRODUCT = path[-2]
        # file_name = f"kmean_{path[-1].split('.')[-2]}"


        # img to show in browser
        file_name = f"kmean_{path[-1].split('.')[-2]}_k{k}.png"
        username = 'someuser'
        cached_file_name = f"cached_{username}_" + file_name
        classification_folder = os.path.join('./cache', 'classification', SATELLITE, PRODUCT, 'show_in_browser')
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, cached_file_name)
        # cached_file_path = './cache' + f'/{cached_file_name}'

        imsave(fname=file_path, arr=reshape_as_image(kmeans_predictions_2d))
        # добавляем палитру для классифицированного изображения
        img = imread(fname=file_path)
        matplotlib_imsave(fname=file_path, arr=img, cmap=colormaps["turbo"], format='png')
        # img.savefig(fname=file_path, cmap=colormaps["turbo"], format='png', transparent=True)

        yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}/show_in_browser'
        self._make_yandex_dir_recursively(yandex_disk_path)
        self.y.upload(file_path, yandex_disk_path + f'/{file_name}', overwrite=True)
        logger.success('success2!')
        

        # GTiff img
        file_name = f"kmean_{path[-1].split('.')[-2]}_k{k}.tif"
        cached_file_name = f"cached_{username}_" + file_name
        classification_folder = os.path.join('./cache', 'classification', SATELLITE, PRODUCT)
        logger.info(f'{classification_folder=}')
        file_path = os.path.join(classification_folder, cached_file_name)

        with rasterio.open(file_path, "w", **meta) as dst:
            dst.write(kmeans_predictions_2d)

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
        yandex_disk_path = f'/miniGIS/images/classification/{SATELLITE}/{PRODUCT}'
        self._make_yandex_dir_recursively(yandex_disk_path)
        self.y.upload(file_path, yandex_disk_path + f'/{file_name}', overwrite=True)

        logger.warning('STEP 1')
        classification_layer = FileHandler().get_classification_layer(
            satellite=SATELLITE, product=PRODUCT, target=file_name, username=username
            )
        logger.warning(f'STEP 1\n{classification_layer=}')

        return ClassificationTM(
            **classification_layer,
            # img_url=url,
            k=k,
            header='Классификация',
            message=f'Тип: k-mean, k={k}',
            datetime=datetime.now(),
        )


