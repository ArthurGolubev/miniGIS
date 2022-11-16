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
            meta.update(count=3)

            reshaped_img = reshape_as_image(img.read())
        reshaped_img = reshaped_img.reshape(-1, 3)
        rows, cols = img.shape
        kmeans_predictions = cluster.KMeans(n_clusters=10, random_state=0).fit(reshaped_img.reshape(-1, 3))
        kmeans_predictions_2d = kmeans_predictions.labels_.reshape(1, rows, cols)
        # logger.info(f"{kmeans_predictions.labels_=}")
        # logger.info(f"{kmeans_predictions_2d.shape=}")

        path = file_path.split('/')
        classification_folder = os.path.join(*path[:-4], 'classification', *path[-3:-2], 'kmean', *path[-2:-1])
        file_format = path[-1][-3:]
        file_name = f"kmean_{path[-1]}_{'_'.join(path[-1][:-4].split('_')[:-1])}.{file_format}"
        Path(classification_folder).mkdir(parents=True, exist_ok=True)
        file_path = os.path.join(classification_folder, file_name)

        # imsave(file_name, kmeans_predictions_2d)
        with rasterio.open(file_path, "w", **meta) as dst:
            dst.write(kmeans_predictions_2d)
            dst.write_colormap(
            1, {
                0: (255, 0, 0, 255),
                9: (0, 0, 255, 255) })


        return ToastMessage(
            header="",
            message="",
            datetime=datetime.now()
        )


