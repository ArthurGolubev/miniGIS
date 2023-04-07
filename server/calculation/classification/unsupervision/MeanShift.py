from loguru import logger
from sklearn import cluster
from sklearn.cluster import estimate_bandwidth
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler

class MeanShift:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path

    def classify(self, n_samples: int = 10000):
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='Mean Shift', alg_param=f'n_samples{n_samples}')
        rows, cols, reshaped_img = img.open_()
        
        bandwidth = estimate_bandwidth(reshaped_img, quantile=0.1, n_samples=n_samples)
        mean_shift = cluster.MeanShift(bandwidth=bandwidth, bin_seeding=True).fit(reshaped_img)
        mean_shift_2d = mean_shift.labels_.reshape(1, rows, cols)

        classification_layer = img.save_(mean_shift_2d)

        return ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: Mean Shift, n_samples={n_samples}',
            datetime=datetime.now(),
        )


