from loguru import logger
from sklearn import mixture
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler
from multiprocessing import Queue

class GaussianMixture:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path

    def classify(self, q: Queue):
        n_components = q.get()
        yandex_disk_path = q.get()
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='GaussianMixture', alg_param=f'n_components{n_components}')
        rows, cols, reshaped_img = img.open_()

        gm = mixture.GaussianMixture(n_components=n_components, covariance_type="tied").fit_predict(reshaped_img)
        gaussian_mixture_predictions_2d = gm.reshape(1, rows, cols)

        classification_layer = img.save_(gaussian_mixture_predictions_2d, path=yandex_disk_path)

        q.put(ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: Gaussian Mixture, n_components={n_components}',
            datetime=datetime.now(),
            operation='/classification/unsupervised/gaussian-mixture'
        ))


