from loguru import logger
from sklearn import cluster
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler

class BisectingKMean:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path

    def classify(self, k: int):
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='Bisecting KMean', alg_param=f'k{k}')
        rows, cols, reshaped_img = img.open_()

        bisecting_kmeans = cluster.BisectingKMeans(n_clusters=k, random_state=0).fit(reshaped_img)
        bisecting_kmeans_predictions_2d = bisecting_kmeans.labels_.reshape(1, rows, cols)

        classification_layer = img.save_(bisecting_kmeans_predictions_2d)

        return ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: Bisecting KMean, k={k}',
            datetime=datetime.now(),
        )


