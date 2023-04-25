from loguru import logger
from sklearn import cluster
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler
from multiprocessing import Queue

class BisectingKMean:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path

    def classify(self, q: Queue):
        k = q.get()
        yandex_disk_path = q.get()
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='BisectingKMean', alg_param=f'k{k}')
        rows, cols, reshaped_img = img.open_()

        bisecting_kmeans = cluster.BisectingKMeans(n_clusters=k, random_state=0).fit(reshaped_img)
        bisecting_kmeans_predictions_2d = bisecting_kmeans.labels_.reshape(1, rows, cols)

        classification_layer = img.save_(bisecting_kmeans_predictions_2d, path=yandex_disk_path)

        q.put(ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: Bisecting KMean, k={k}',
            datetime=datetime.now(),
            operation='/classification/unsupervised/bisecting-kmean'
        ))



