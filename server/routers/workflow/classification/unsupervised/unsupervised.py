from loguru import logger
from .....models import KMeanOptions
from .....models import BisectingKMeanOptions
from .....models import GaussianMixtureOptions
from .....models import MeanShiftOptions
from .....models import ClassificationTM
from .....sio import sio
from humps import decamelize
from multiprocessing import Process, Queue
import asyncio

from .....calculation.classification.unsupervision.KMean import KMean
from .....calculation.classification.unsupervision.MeanShift import MeanShift
from .....calculation.classification.unsupervision.BisectingKMean import BisectingKMean
from .....calculation.classification.unsupervision.GaussianMixture import GaussianMixture




@sio.on('unsupervised/kmean')
async def classify_kmean(sid, msg):
    data = KMeanOptions.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = KMean(session['user'], data.file_path)
    q = Queue()
    data = {
        "alg_param": data.k,
        "yandex_disk_path": ""
    }
    q.put(data)
    p = Process(target=alg.classify, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ClassificationTM = q.get()
    # print(result)
    await sio.emit("unsupervised/kmean", result.json())


@sio.on('unsupervised/bisecting-kmean')
async def classify_bisecting_kmean(sid, msg):
    data = BisectingKMeanOptions.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = BisectingKMean(session['user'], data.file_path)
    q = Queue()
    data = {
        "alg_param": data.k,
        "yandex_disk_path": ""
    }
    q.put(data)
    p = Process(target=alg.classify, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ClassificationTM = q.get()
    # print(result)
    await sio.emit("unsupervised/bisecting-kmean", result.json())


@sio.on('unsupervised/gaussian-mixture')
async def classify_gaussian_mixture(sid, msg):
    data = GaussianMixtureOptions.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = GaussianMixture(session['user'], data.file_path)
    q = Queue()
    data = {
        "alg_param": data.n_components,
        "yandex_disk_path": ""
    }
    q.put(data)
    p = Process(target=alg.classify, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ClassificationTM = q.get()
    # print(result)
    await sio.emit("unsupervised/gaussian-mixture", result.json())


@sio.on('unsupervised/mean-shift')
async def classify_mean_shift(sid, msg):
    data = MeanShiftOptions.parse_obj(decamelize(msg))
    session = await sio.get_session(sid)
    alg = MeanShift(session['user'], data.file_path)
    q = Queue()
    data = {
        "alg_param": data.n_samples,
        "yandex_disk_path": ""
    }
    q.put(data)
    p = Process(target=alg.classify, args=(q,))
    p.start()
    while p.is_alive():
        await asyncio.sleep(5)
    p.join()
    result: ClassificationTM = q.get()
    # print(result)
    await sio.emit("unsupervised/mean-shift", result.json())
