import shapefile
from io import BytesIO
from loguru import logger
from sqlmodel import Session
from server.models import User1
from multiprocessing import Queue
from server.models import Algorithm
from server.models import ClipToMask
from datetime import datetime, timedelta
from server.models import SearchPreviewTM
from server.models import Period, Coordinates
from server.calculation.FileHandler import FileHandler
from server.calculation.EarthEngine import EarthEngine
from server.models import DownloadSentinel, SentinelMeta
from server.calculation.YandexDiskHadler import YandexDiskHandler
from server.calculation.classification.unsupervision.KMean import KMean
from server.calculation.classification.unsupervision.MeanShift import MeanShift
from server.calculation.classification.unsupervision.BisectingKMean import BisectingKMean
from server.calculation.classification.unsupervision.GaussianMixture import GaussianMixture
from server.models import GeoJSON, ClipToMask
import yadisk
from server.models import ToastMessage
from json import dumps

class Automation(YandexDiskHandler):
    def __init__(self, user: User1, session: Session, alg_type: str):
        super().__init__(user=user)
        self._make_yandex_dir_recursively('/miniGIS/automation')
        self.user = user
        self.session = session
        self.alg_type = alg_type
        if self.alg_type == 'monitoring':
            self.alg_path = '/miniGIS/automation/monitoring'
        else:
            self.alg_path = '/miniGIS/automation/archive-data-processing'
        self.q = Queue()



    def save_monitoring_algorithm_mask(self, msg):
        mask = msg["mask"]
        self._make_yandex_dir_recursively(f'{self.alg_path}/{msg["algName"]}/mask')
        yandex_disk_path = f'{self.alg_path}/{msg["algName"]}/mask/mask'
        shp_io = BytesIO()
        shx_io = BytesIO()
        dbf_io = BytesIO()
        with shapefile.Writer(shp=shp_io, shx=shx_io, dbf=dbf_io) as shp:
            shp.poly(mask['geometry']['coordinates'])
            shp.field('empty', 'L')
            shp.record(False)


        shp_io.seek(0)
        shx_io.seek(0)
        dbf_io.seek(0)
        try:
            self.y.upload(shp_io, yandex_disk_path + '.shp', overwrite=True)
            self.y.upload(shx_io, yandex_disk_path + '.shx', overwrite=True)
            self.y.upload(dbf_io, yandex_disk_path + '.dbf', overwrite=True)
            lat = msg.get('poi')['lat']
            lon = msg.get('poi')['lon']
            if msg["algType"] == 'dataProcessing':
                start_date = msg["date"]["startDate"]
                end_date = msg["date"]["endDate"]
            else:
                start_date = None
                end_date = None
            self.alg = Algorithm(
                user_id=self.user.id,
                last_file_name='',
                mask=yandex_disk_path,
                poi=f"{lat},{lon}",
                sensor=msg.get('sensor'),
                alg_param=msg.get('param'),
                alg_name=msg.get('alg'),
                bands=",".join(msg.get('bands')),
                name=msg.get('algName'),
                start_date=start_date,
                end_date=end_date,
            )
            self.session.add(self.alg)
            self.session.commit()
            self.session.refresh(self.alg)
            return ToastMessage(
                header='Создание алгоритма',
                message=f'Алгоритм "{msg["algName"]}" создан',
                operation='automation/monitoring',
                datetime=datetime.now()
            )
        except yadisk.exceptions.LockedError:
            return ToastMessage(
                header='Ошибка',
                message=f'Загрузка файлов недоступна, можно только просматривать и скачивать. Вы достигли ограничения по загрузке файлов',
                operation='automation/monitoring',
                datetime=datetime.now()
            )



    def search_new_image(self, period: bool = False):
        # dev
        if not period:
            start_date = (datetime.today() - timedelta(days=4)).strftime('%Y-%m-%d')
            end_date = datetime.today().strftime('%Y-%m-%d')
        else:
            start_date = self.alg.start_date
            end_date = self.alg.end_date

        # prod
        # start_date = datetime.today().strftime('%Y-%m-%d')
        # end_date = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')

        date = Period(start_date=start_date, end_date=end_date)
        lat, lon = self.alg.poi.split(',')
        coord = Coordinates(lat=float(lat), lon=float(lon))
        msg: SearchPreviewTM = EarthEngine(user=self.user).search_preview(poi=coord, sensor=self.alg.sensor, date=date)

        return msg



    def download_new_image(self, image):
        logger.info("DOWNLOAD NEW IMAGE!")
        sm = SentinelMeta(
            product_id=image["PRODUCT_ID"],
            bands=self.alg.bands.split(','),
            granule_id=image["GRANULE_ID"],
            mgrs_tile=image["MGRS_TILE"]
        )
        ds = DownloadSentinel(
            sentinel_meta=sm,
            sensor=self.alg.sensor,
            system_index=image["system:index"],
            meta=dumps(image)
        )
        self.q.put(ds)
        
        self.q.put(f'{self.alg_path}/{self.alg.name}/')
        EarthEngine(user=self.user).download_sentinel(q=self.q)
        self.session.add(self.alg)
        self.session.commit()
        self.session.refresh(self.alg)
        c = self.q.get()
        logger.info(f'{c=}')
        self.yandex_disk_path = c["yandex_disk_path"]



    def clip_new_image(self):
        logger.info('CLIP NEW IMAGE!')
        f = FileHandler(user=self.user)
        
        result = f.shp_read(f'{self.alg_path}/{self.alg.name}/mask/mask.shp')
        feature = result["features"][0]
        gj = GeoJSON(
            geometry=feature["geometry"],
            properties=feature["properties"],
            type=feature["type"]
        )
        files: str = self.y.listdir(self.yandex_disk_path + '/raw')
        ctm = ClipToMask(
            files=[x.path.split(":")[1] for x in files if not x.path.endswith('.txt')],
            mask=gj
        )
        self.q.put(ctm)
        self.q.put(self.yandex_disk_path)
        f.clip_to_mask(q=self.q)
        c = self.q.get()
        return c["clipped_files"]



    def stack_new_image(self):
        logger.info("STACK NEW IMAGE!")
        f = FileHandler(user=self.user)
        logger.info(f"{self.yandex_disk_path=}")
        files: str = self.y.listdir(self.yandex_disk_path + '/clipped')
        clipped_files=[x.path.split(":")[1] for x in files]
        self.q.put(clipped_files)
        self.q.put(self.yandex_disk_path)
        f.stack_bands(q=self.q)
        c = self.q.get()
        return c["stack_file"]



    def classificate_new_image(self):
        logger.info("CLASSIFICATE NEW IMAGE!")
        self.q.put({
            "alg_param": self.alg.alg_param,
            "yandex_disk_path": self.yandex_disk_path,
            })
        files: str = self.y.listdir(self.yandex_disk_path + '/stack')
        stack_file=[x.path.split(":")[1] for x in files][0]
        match self.alg.alg_name:
            case "KMean":
                KMean(self.user, file_path=stack_file).classify(q=self.q)
            case "BisectingKMean":
                BisectingKMean(user=self.user, file_path=stack_file).classify(q=self.q)
            case "GaussianMixture":
                GaussianMixture(user=self.user, file_path=stack_file).classify(q=self.q)
            case "MeanShift":
                MeanShift(user=self.user, file_path=stack_file).classify(q=self.q)
        return self.q.get()
