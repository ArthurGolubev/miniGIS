import spectral
import numpy as np
import rasterio
from glob import glob
import os
from loguru import logger
from sklearn import cluster
from rasterio.plot import reshape_as_image, reshape_as_raster
from skimage.io import imsave, imread
from Types import ToastMessage
from datetime import datetime
from pathlib import Path



class Classifier:

    def k_mean(self, file_path: str, k: int) -> ToastMessage:
        with rasterio.open(file_path) as img:
            meta = img.meta
            meta.update(driver="GTiff")
            # meta.update(driver="PNG")
            meta.update(count=1)
            meta.update(compress='lzw')

            reshaped_img = reshape_as_image(img.read())
        reshaped_img = reshaped_img.reshape(-1, 3)
        rows, cols = img.shape
        kmeans_predictions = cluster.KMeans(n_clusters=10, random_state=0).fit(reshaped_img.reshape(-1, 3))
        kmeans_predictions_2d = kmeans_predictions.labels_.reshape(1, rows, cols)
        # logger.info(f"{kmeans_predictions.labels_=}")
        # logger.info(f"{kmeans_predictions_2d.shape=}")

        path = file_path.split('/')
        file_name = f"kmean_{path[-1].split('.')[-2]}"


        # img to show in browser
        file_name = f"kmean_{path[-1].split('.')[-2]}.png"
        classification_folder = os.path.join(*path[:-4], 'classification', *path[-3:-2], *path[-2:-1], 'show_in_browser')
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, file_name)

        imsave(file_path, reshape_as_image(kmeans_predictions_2d) )


        # GTiff img
        file_name = f"kmean_{path[-1].split('.')[-2]}.tif"
        classification_folder = os.path.join(*path[:-4], 'classification', *path[-3:-2], *path[-2:-1])
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, file_name)

        with rasterio.open(file_path, "w", **meta) as dst:
            dst.write(kmeans_predictions_2d)
            dst.write_colormap(
                1,
                {
                    0: (255, 0, 0, 255),
                    1: (152, 208, 98, 255),
                    2: (152, 208, 0, 255),
                    3: (102, 208, 30, 255),
                    9: (0, 0, 255, 255)
                }
            )


        return ToastMessage(
            header="",
            message="",
            datetime=datetime.now()
        )


