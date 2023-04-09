from fastapi import APIRouter, Depends
from server.models import KMeanOptions
from server.models import BisectingKMeanOptions
from server.models import GaussianMixtureOptions
from server.models import MeanShiftOptions
from server.models import ClassificationTM
from server.models import User1
from server.auth import get_current_user


from server.calculation.classification.unsupervision.KMean import KMean
from server.calculation.classification.unsupervision.MeanShift import MeanShift
from server.calculation.classification.unsupervision.BisectingKMean import BisectingKMean
from server.calculation.classification.unsupervision.GaussianMixture import GaussianMixture


router = APIRouter(
    prefix='/unsupervised',
    )


@router.post('/k-mean', response_model=ClassificationTM)
async def classify_kmean(options: KMeanOptions, user: User1 = Depends(get_current_user)):
    return KMean(user, options.file_path).classify(options.k)


@router.post('/bisecting-kmean', response_model=ClassificationTM)
async def classify_bisecting_kmean(options: BisectingKMeanOptions, user: User1 = Depends(get_current_user)):
    return BisectingKMean(user, options.file_path).classify(options.k)


@router.post('/gaussian-mixture', response_model=ClassificationTM)
async def classify_gaussian_mixture(options: GaussianMixtureOptions, user: User1 = Depends(get_current_user)):
    return GaussianMixture(user, options.file_path).classify(options.n_components)


@router.post('/mean-shift', response_model=ClassificationTM)
async def classify_mean_shift(options: MeanShiftOptions, user: User1 = Depends(get_current_user)):
    return MeanShift(user, options.file_path).classify(options.n_samples)

