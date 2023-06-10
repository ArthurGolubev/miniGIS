import numpy as np
from loguru import logger
from sklearn import mixture
from datetime import datetime

from server.models import ClassificationTM
from server.calculation.classification.unsupervision.ImgHandler import ImgHandler
from multiprocessing import Queue
from sklearn import metrics
from sklearn.model_selection import train_test_split




class GaussianMixture:
    def __init__(self, user, file_path: str) -> None:
        self.user = user
        self.file_path = file_path


    def classify(self, q: Queue):
        data = q.get()
        n_components = data["alg_param"]
        yandex_disk_path = data["yandex_disk_path"]
        img = ImgHandler(user=self.user, file_path=self.file_path, alg_name='GaussianMixture', alg_param=f'n_components{n_components}')
        rows, cols, reshaped_img, band_stats = img.open_()


        X_train, X_test = train_test_split(reshaped_img, test_size=0.5)

        logger.info(f"\n\n\n{X_train.shape=}\n{X_test.shape=}\n\n\n")
        X_train = np.resize(X_train, X_test.shape)
        logger.info(f"\n\n\n{X_train.shape=}\n{X_test.shape=}\n\n\n")

        train1 = mixture.GaussianMixture(n_components=n_components, covariance_type="tied")
        train1_fit = train1.fit(X_train)


        predict = train1_fit.predict(X_test)

        c = mixture.GaussianMixture(n_components=n_components, covariance_type="tied")
        gaussian_mixture_predictions = c.fit(reshaped_img)



        statistic = {}

        c21 = metrics.confusion_matrix(train1_fit.labels_, predict).tolist()
        c22 = metrics.classification_report(
            train1_fit.labels_,
            predict,
            target_names=[f"Class {x + 1}" for x in range(n_components)],
            output_dict=True
        )
        
        logger.info(f'{c21}')
        logger.info(f'{c22}')
        logger.info(f'{statistic}')

        statistic['confusion_matrix'] = c21
        statistic['classification_report'] = c22
        statistic['band_stats'] = band_stats

        gaussian_mixture_predictions_2d = c.predict(reshaped_img)

        unique_classes, count_pixels = np.unique(gaussian_mixture_predictions_2d, return_counts=True)
        unique_classes = unique_classes.tolist()
        count_pixels = count_pixels.tolist()

        pixels_per_class = {f"Class {k}": v for k, v in zip(unique_classes, count_pixels)}
        statistic['pixels_per_class'] = pixels_per_class


        gaussian_mixture_predictions_2d = gaussian_mixture_predictions.labels_.reshape(1, rows, cols)


        classification_layer = img.save_(
            predictions_2d=gaussian_mixture_predictions_2d,
            statistic=statistic,
            path=yandex_disk_path,
            k=n_components
            )


        q.put(ClassificationTM(
            **classification_layer,
            header='Классификация',
            message=f'Тип: Gaussian Mixture, n_components={n_components}',
            datetime=datetime.now(),
            operation='/classification/unsupervised/gaussian-mixture'
        ))


