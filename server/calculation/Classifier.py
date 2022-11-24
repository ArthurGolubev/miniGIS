import spectral
import numpy as np
import rasterio
from glob import glob
import os
from loguru import logger
from sklearn import cluster
from rasterio.plot import reshape_as_image, reshape_as_raster
from skimage.io import imsave
from Types import ClassificationTM
from datetime import datetime
from pathlib import Path
from .FileHandler import FileHandler
from matplotlib.pyplot import imread
from matplotlib.pyplot import imsave as matplotlib_imsave
from matplotlib import colormaps



class Classifier:

    def k_mean(self, file_path: str, k: int) -> ClassificationTM:
        with rasterio.open(file_path) as img:
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
        file_name = f"kmean_{path[-1].split('.')[-2]}"


        # img to show in browser
        file_name = f"kmean_{path[-1].split('.')[-2]}_k{k}.png"
        classification_folder = os.path.join(*path[:-4], 'classification', *path[-3:-2], *path[-2:-1], 'show_in_browser')
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, file_name)

        imsave(fname=file_path, arr=reshape_as_image(kmeans_predictions_2d))
        img = imread(fname=file_path)
        matplotlib_imsave(fname=file_path, arr=img, cmap=colormaps["turbo"], format='png')
        logger.success('success2!')
        

        # GTiff img
        file_name = f"kmean_{path[-1].split('.')[-2]}_k{k}.tif"
        classification_folder = os.path.join(*path[:-4], 'classification', *path[-3:-2], *path[-2:-1])
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, file_name)

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
        classification_layer = FileHandler().get_classification_layer(file_path=file_path)

        return ClassificationTM(
            **classification_layer,
            k=k,
            header='Классификация',
            message=f'Тип: k-mean, k={k}',
            datetime=datetime.now(),
        )


