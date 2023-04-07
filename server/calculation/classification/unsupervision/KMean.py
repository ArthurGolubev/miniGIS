from loguru import logger
from sklearn import cluster
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler

class KMean:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path

    def classify(self, k: int):
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='KMean', alg_param=f'k{k}')
        rows, cols, reshaped_img = img.open_()

        c = cluster.KMeans(n_clusters=k, random_state=0)
        kmeans_predictions = c.fit(reshaped_img)
        kmeans_predictions_2d = kmeans_predictions.labels_.reshape(1, rows, cols)

        classification_layer = img.save_(kmeans_predictions_2d)

        return ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: k-mean, k={k}',
            datetime=datetime.now(),
        )


