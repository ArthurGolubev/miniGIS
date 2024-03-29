import os
import rasterio
import geopandas as gpd
import rioxarray as rxr
import earthpy.spatial as es
import shapefile
import json
import yadisk

from pathlib import Path
from loguru import logger
from datetime import datetime
from shapely.geometry import Polygon
from pyproj import Transformer
from io import BytesIO
from ..models import ToastMessage, ClipToMask
from ..models import AddLayerTM
from ..models import User1
from ..calculation.EarthEngine import EarthEngine
from ..calculation.YandexDiskHadler import YandexDiskHandler

from multiprocessing import Queue


class FileHandler(YandexDiskHandler):

    def __init__(self, user: User1):
        super().__init__(user=user)
        self._make_yandex_dir_recursively('/miniGIS/workflow')
        self.user = user
        
        self.clear_path = lambda x: x.path.split(':')[1]
        self.get_last_elem = lambda x: x.split('/')[-1]


    def get_algorithms_yandex(self):
        result = [x.path.split('/')[-1] for x in self.y.listdir('/miniGIS/automation/archive-data-processing')]
        result.extend([x.path.split('/')[-1] for x in self.y.listdir('/miniGIS/automation/monitoring')])
        return result
        




    def algorithm_results(self, alg_path, alg_type):
        logger.debug(f"{alg_path=}")
        results = self.y.listdir('/' + alg_path)

        logger.info(f"{list(results)=}")


    def shp_save(self, shp_name, layer):
        """
        шейпфайл будет состоять из списка геометрий geoJSON
        1. Если в списке одна геометрия - один geoJSON, то создаётся один шейп с одной геометрией
        2. Если в списке несколько геометрий - несколько geo............
        """
        if type(layer) == str:
            c = json.loads(layer)
            logger.info(f"{json.loads(layer)=}")
        else:
            c = layer
        self._make_yandex_dir_recursively('/miniGIS/workflow/vector')

        file_name = f'{"".join([x for x in shp_name.title() if x.isalpha() or x.isdigit()])}'
        # local_path = f'./cache/vector/{file_name}'
        yandex_disk_path = f'/miniGIS/workflow/vector/{file_name}'
        dt = datetime.now().strftime("%Y%m%d_%H%M%S")
        yandex_disk_path = yandex_disk_path if not self.y.exists(yandex_disk_path + '.shp') else f"{yandex_disk_path}_{dt}"


        shp_io = BytesIO()
        shx_io = BytesIO()
        dbf_io = BytesIO()

        with shapefile.Writer(shp=shp_io, shx=shx_io, dbf=dbf_io) as shp:
            features = c.get('features', [])
            if len(features) > 0:
                properties = features[0].get('properties')
                if properties:
                    for attr in properties.keys():
                        _, attr_type = attr.split('_')
                        shp.field(attr, attr_type)
                else:
                    shp.field('NullAttr', 'L')

                for shape in features:
                    props = []
                    for k, v in properties.items():
                        attr_type = k.split('_')[1]
                        if attr_type == 'D':
                            if v != '':
                                d = datetime.strptime(v, '%Y-%m-%d').date()
                            else:
                                d = ''
                            props.append(d)
                        elif attr_type == 'L':
                            d = False if v == False or v == '' else True
                            props.append(d)
                        else:
                            logger.info(f"{v=}")
                            props.append(v)
                    geom = shape['geometry']
                    if geom['type'] == 'Point':
                        shp.point(geom['coordinates'][0], geom['coordinates'][1])
                    elif geom['type'] == 'LineString':
                        shp.line([geom['coordinates']])
                    elif geom['type'] == 'Polygon':
                        shp.poly(geom['coordinates'])
                    # if len(props) == 0: props.append(False)
                    shp.record(*props)
        shp_io.seek(0)
        shx_io.seek(0)
        dbf_io.seek(0)
        try:
            self.y.upload(shp_io, yandex_disk_path + '.shp', overwrite=True)
            self.y.upload(shx_io, yandex_disk_path + '.shx', overwrite=True)
            self.y.upload(dbf_io, yandex_disk_path + '.dbf', overwrite=True)
            return ToastMessage(
                datetime=datetime.now(),
                header='Сохранение шейп-файла',
                message=f"Файл сохранён",
                operation="shp-save"
            )
        except yadisk.exceptions.LockedError:
            return ToastMessage(
                datetime=datetime.now(),
                header='Сохранение шейп-файла',
                message=f"Загрузка файлов недоступна, можно только просматривать и скачивать. Вы достигли ограничения по загрузке файлов",
                operation="shp-save"
            )


    def shp_read(self, name: str):
        logger.info(f'\n\n\nname1 {name=}\n\n\n')
        name = name.split('.')[0]
        logger.info(f'\n\n\nname2 {name=}\n\n\n')

        shp_io = BytesIO()
        shx_io = BytesIO()
        dbf_io = BytesIO()

        self.y.download(name + '.shp', shp_io)
        self.y.download(name + '.shx', shx_io)
        self.y.download(name + '.dbf', dbf_io)
        
        with shapefile.Reader(shp=shp_io, shx=shx_io, dbf=dbf_io) as shp:
            return shp.__geo_interface__




    def stack_bands(self,q: Queue):
        files: list[str] = q.get()
        yandex_disk_path = q.get()
        bands = sorted(files)
        logger.debug(f'123 -> {bands=}')
        temp_file = f'./cache/temp_username_{bands[0].split("/")[-1]}'
        
        self.y.download(bands[0], temp_file)
        src = rasterio.open(temp_file)
        meta = src.meta
        logger.info(f"{meta=}")
        meta.update(count=len(bands))
        meta.update(driver="GTiff")
        os.remove(temp_file)

        # Создаём композитное изображение
        path = bands[0].split('/')
        stack_folder = os.path.join('./cache')
        file_format = path[-1][-3:]
        bands_names = [band.split('/')[-1][:-4].split('_')[-1] for band in bands]
        file_name = f"stack_{'_'.join(bands_names)}_{'_'.join(path[-1][:-4].split('_')[:-1])}.tif"

        logger.info(f"{bands_names=}")
        logger.info(f"{file_format=}")
        logger.info(f"{file_name=}")
        logger.info(f"{stack_folder=}")
        logger.info(f"{files[0].split('/')[4:6]=}")
        SATELLITE, PRODUCT = files[0].split('/')[4:6]

        if yandex_disk_path == '/miniGIS/workflow/':
            # вариант вызываемый из workflow
            yandex_disk_path += os.path.join(path[-4], path[-3], 'stack')
            # yandex_disk_path = f'/miniGIS/workflow/{SATELLITE}/{PRODUCT}/stack'
        else:
            # в случае вызова из автоматизации
            yandex_disk_path += '/stack'

        self._make_yandex_dir_recursively(yandex_disk_path)

        # Path(stack_folder).mkdir(parents=True, exist_ok=True) # рудимент, использовавшийся при разработке. но на всякий случай, пусть будет
        file_path = os.path.join(stack_folder, file_name)

        with rasterio.open(file_path, "w", **meta) as dst:
            # по соглашению GDLA, слои нумеруются с 1
            for id, layer in enumerate(bands, start=1):
                temp_file = f'./cache/{layer.split("/")[-1]}'
                self.y.download(layer, temp_file)
                # with rasterio.open(layer) as src:
                with rasterio.open(temp_file) as src:
                    dst.write_band(id, src.read(1))
                    dst.update_tags(id, band_name=bands_names[id-1])
                os.remove(temp_file)
        file_ = yandex_disk_path + f'/{file_name}'
        try:
            self.y.upload(file_path, file_, overwrite=True)
            os.remove(file_path)
            q.put(
                {
                "tm": ToastMessage(
                    header="Объединение слоёв",
                    message=f"слои {bands} объеденены в {file_name}",
                    datetime=datetime.now(),
                    operation='stack-bands'
                ),
                "stack_file": file_
            })
        except yadisk.exceptions.LockedError:
            os.remove(file_path)
            q.put(
                {
                "tm": ToastMessage(
                    header="ОШИБКА",
                    message=f"Загрузка файлов недоступна, можно только просматривать и скачивать. Вы достигли ограничения по загрузке файлов",
                    datetime=datetime.now(),
                    operation='stack-bands'
                ),
                "stack_file": file_
            })



    def tree_available_files(self):
        raw = {}
        classification = {}

        logger.success('OK!')
        yandex_disk_path = '/miniGIS/workflow/classification/'
        self._make_yandex_dir_recursively(yandex_disk_path)
        for satellite in [x.path.split(':')[1] for x in self.y.listdir(yandex_disk_path)]:
            logger.info(f'{satellite=}')
            s = satellite.split('/')[-1]
            classification[s] = {}
            for product in [x.path.split(':')[1] for x in self.y.listdir(satellite)]:
                p = product.split('/')[-1]
                logger.debug(f"{product=}") 
                classification[s][p] = [x.path.split('/')[-1] for x in self.y.listdir(product + '/show_in_browser') if x.type == 'file']
        

        yandex_disk_path = '/miniGIS/workflow/raw'
        self._make_yandex_dir_recursively(yandex_disk_path)
        for satellite in [x.path.split(':')[1] for x in self.y.listdir(yandex_disk_path)]:
            s = satellite.split('/')[-1]
            raw[s] = {}
            for product in [x.path.split(':')[1] for x in self.y.listdir(satellite)]:
                p = product.split('/')[-1]
                raw[s][p] = None
        

        yandex_disk_path = '/miniGIS/workflow/vector'
        self._make_yandex_dir_recursively(yandex_disk_path)
        shapes = [x.path.split(':')[1] for x in self.y.listdir(yandex_disk_path) if x.name.endswith('.shp')]

        return {
            "raw": raw,
            "classification": classification,
            "vector": shapes
        }





    def add_layer(self, scope, satellite, product, target) -> AddLayerTM:
        logger.debug(__name__)
        p = os.path.join('/miniGIS/workflow', scope, satellite, product)
        
        if scope == 'raw':
            yandex_disk_path = os.path.join(p, 'preview.txt')
            with BytesIO() as file_io:
                self.y.download(yandex_disk_path, file_io)
                file_io_read = file_io.getvalue().decode('utf-8').split('\n')
                sensor = file_io_read[0].strip()
                system_index = file_io_read[1].strip()
                img_url = EarthEngine(user=self.user).show_images_preview(sensor=sensor, system_index=system_index).img_url
                metadata = file_io_read[2].strip()
        elif scope == 'classification':
            res = self.get_classification_layer(satellite=satellite, product=product, target=target)
            img_url=res["img_url"]
            metadata=json.dumps(res["metadata"])
        return AddLayerTM(
            header='Добавлен слой',
            message=f'',
            datetime=datetime.now(),
            imgUrl=img_url,
            meta=metadata,
            operation='add-layer'
        )
    




    def available_files(self, to: str) -> dict[str, dict[str, list[str]]]:
        
        

        response = {'satellites': {}}
        satellites = [self.clear_path(x) for x in self.y.listdir('/miniGIS/workflow')]
        for satellite in satellites:
            products = [self.clear_path(x) for x in self.y.listdir(satellite)]
            _satellite = self.get_last_elem(satellite)
            response['satellites'][_satellite] = {}
            for product in products:
                results = [self.clear_path(x) for x in self.y.listdir(product)]
                _product = self.get_last_elem(product)
                response['satellites'][_satellite][_product] = {}
                for result in results:
                    data = [self.clear_path(x) for x in self.y.listdir(result)]
                    _result = self.get_last_elem(result)
                    _data = [x for x in data if not x.endswith('.txt')]
                    response['satellites'][_satellite][_product][_result] = {self.get_last_elem(v): v for v in _data}
        logger.success(f'\n\n\n{response=}\n\n\n')
        return response
        
        



    def clip_to_mask(self, q: Queue):
        data: ClipToMask = q.get()
        yandex_disk_path = q.get()
        mask = data.mask
        files = data.files
        g = mask.geometry["coordinates"]
        d1 = {'col1': ['mask'], 'geometry': [Polygon(g[0])]}
        gdf = gpd.GeoDataFrame(d1, crs="EPSG:4326")
        # gdf = gpd.GeoDataFrame(d1, crs="EPSG:32630")
        clipped_files = []
        
        if yandex_disk_path == '/miniGIS/workflow/':
            path = files[0].split('/')
            # вариант вызываемый из workflow
            yandex_disk_path += os.path.join(path[-4], path[-3], 'clipped')
        else:
            # в случае вызова из автоматизации
            yandex_disk_path += '/clipped'

        for band_path in files:
            path = band_path.split('/')
            temp_file = f'./cache/clip_to_mask_user_{band_path.split("/")[-1]}'
            self.y.download(band_path, temp_file)
            
            band_crs = es.crs_check(temp_file)
            mask = gdf.to_crs(band_crs)

            try:
                clipped = rxr.open_rasterio(temp_file, masked=True).rio.clip(mask.geometry, from_disk=True).squeeze()
            except ValueError:
                q.put(ToastMessage(
                header="Обрезка по маске не завершена",
                message="Маска не перекрывает растер",
                datetime=datetime.now(),
                operation='clip-to-mask'
            ))
                return
            finally:
                os.remove(temp_file)

            
            
            file_format = path[-1][-3:]
            file_name = f"clipped_{path[-1][:-4]}.{file_format}"
            logger.info(f"{file_name=}")
            # Path(clipped_folder).mkdir(parents=True, exist_ok=True)
            local_path = './cache' + f'/{file_name}'
            clipped.rio.to_raster(local_path)
            self._make_yandex_dir_recursively(yandex_disk_path)

            file_ = yandex_disk_path  + f'/{file_name}'
            try:
                self.y.upload(local_path, file_, overwrite=True)
                clipped_files.append(file_)
                os.remove(local_path)
                tm = {
                    "tm": ToastMessage(
                        header="Обрезка завершена - output.tif",
                        message="Обрезка по маске",
                        datetime=datetime.now(),
                        operation='clip-to-mask'
                    ),
                    "clipped_files": clipped_files
                }
            except yadisk.exceptions.LockedError:
                os.remove(local_path)
                tm = {
                    "tm": ToastMessage(
                        header="Обрезка завершена - output.tif",
                        message="Обрезка по маске",
                        datetime=datetime.now(),
                        operation='clip-to-mask'
                    ),
                    "clipped_files": clipped_files
                }
                break
        q.put(tm)




    def get_classification_layer(self, satellite: str, product: str, target: str, username: str = 'someuser') -> dict:

        # target = target.split(".")[-2]

        cached_target = f'cached_{username}_{target}'
        png_file_path = f'./cache/classification/{satellite}/{product}/show_in_browser'
        tif_file_path = f'./cache/classification/{satellite}/{product}'

        # TODO во-первых: не обязательно скачивать на диск, можно BytesIO
        # Во-вторых: я делаю метафайл для .png, в котором будет лежать координаты слоя .tif => следует удалить или изменить этот метод
        if not os.path.exists(png_file_path + f'/{cached_target}.png'):
            Path(png_file_path).mkdir(exist_ok=True, parents=True)
            yandex_disk_path = f'/miniGIS/images/classification/{satellite}/{product}/show_in_browser/{target}.png'
            local_path = png_file_path + f'/{cached_target}.png'
            self.y.download(yandex_disk_path, local_path)
            logger.success('SUCCESS get png!')
        if not os.path.exists(tif_file_path + f'/{cached_target}.tif'):
            Path(tif_file_path).mkdir(exist_ok=True, parents=True)
            yandex_disk_path = f'/miniGIS/images/classification/{satellite}/{product}/{target}.tif'
            local_path = tif_file_path + f'/{cached_target}.tif'
            self.y.download(yandex_disk_path, local_path)
            logger.success('SUCCESS get tif!')


        with rasterio.open(tif_file_path + f'/{cached_target}.tif') as f:
            bounds = f.bounds
            crs = f.crs
            logger.info(f'\n\n\n{crs=}\n\n\n')
        os.remove(tif_file_path + f'/{cached_target}.tif')

        # transformer = Transformer.from_crs(32629, 4326, always_xy=True)
        transformer = Transformer.from_crs(crs, 4326, always_xy=True)
        left_bottom = transformer.transform(bounds[0], bounds[1])
        right_top = transformer.transform(bounds[2], bounds[3])

        # left_bottom = [bounds[0], bounds[1]]
        # right_top = [bounds[2], bounds[3]]


        return {
            "file_name": target,
            "img_url": png_file_path + f'/{cached_target}.png',
            "metadata": {
                "system:footprint": {
                    "coordinates": [left_bottom, right_top]
                }
            },
            "coordinates": [left_bottom, right_top]
            }
    
    
    async def get_products_by_path(self, path: str, sio):
        products = self.y.listdir(path)
        products = sorted(products, key=lambda x: x.created)
        products = list(filter(lambda x: not x.endswith("mask"), [self.clear_path(x) for x in products]))
        iters = len(products)
        logger.debug(f"STEP 1")

        for i, product in enumerate(products):
            date = self.get_last_elem(product).split("_")[-1][0:8]

            preview_path = product + '/raw/preview.txt'
            preview_file = BytesIO()
            logger.debug(f'{preview_path=}')
            self.y.download(preview_path, preview_file)
            preview_file.seek(0)
            preview = preview_file.read().decode('UTF-8').split('\n')
            logger.debug(f"\n\n{preview=}\n\n")
            preview_response = EarthEngine(user=self.user).show_images_preview(sensor=preview[0], system_index=preview[1])
            logger.info(f"\n\n{preview_response=}\n\n")
            img_url = preview_response.img_url
            bounds  = preview_response.bounds
            

            classifications_path = product + '/classification/show_in_browser'
            files = [self.clear_path(x) for x in self.y.listdir(classifications_path)]
            imgs = []
            metafiles = []
            logger.debug(f"ITER {i}")
            for x in files:
                if x.endswith(".metafile"):
                    metafiles.append(x)
                elif x.endswith(".png"):
                    imgs.append(x)


            logger.debug(f"STEP 2")
            for classification in imgs:
                img = BytesIO()
                self.y.download(classification, img)
                metafile = classification.replace(".png", ".metafile")
                meta = None
                if metafile in metafiles:
                    meta = BytesIO()
                    self.y.download(metafile, meta)
                    meta.seek(0)
                    meta = meta.read().decode('UTF-8')

                img.seek(0)
                logger.debug(f"STEP 3")
                await sio.emit('algorithm/timeline', {
                    "classification": {
                        "img": img.read(),
                        "meta": meta,
                        "date": f'{datetime.strptime(date, "%Y%m%d").date()}',
                    },

                    "preview": {
                        "img_url": img_url,
                        "bounds": bounds
                    },
                    
                    "progress": {
                        "iter": i+1,
                        "iters": iters
                    }
                    })






    def get_yandex_disk_token(self):
        t = os.getenv('YANDEX_DISK_TOKEN_FOR_APP_MINIGIS')
        # logger.success(t)

        y = yadisk.YaDisk(id=os.getenv('YANDEX_API_CLIENT_ID'), secret=os.getenv('YANDEX_API_CLIENT_SECRET'))
        url = y.get_code_url()

        logger.info(f"{url=}")

        code = input('access code: ')

        try:
            response = y.get_token(code)
        except:
            logger.error('ERROR!')

        y.token = response.access_token

        if y.check_token():
            response = 'success get token'
            logger.success(f'success get token {response.access_token=}')
        else:
            response = 'token not received'
            logger.warning('token not received')
        
        return response
        # yadisk.YaDisk(os.getenv(f'YANDEX_DISK_TOKEN_FOR_APP_MINIGIS'))


    def check_yandex_disk_info(self):
        y = yadisk.YaDisk(token=os.getenv('YANDEX_DISK_TOKEN_FOR_APP_MINIGIS'))
        response = y.get_disk_info()

        logger.info(f"{response=}")

        # response = list(y.listdir("/se"))
        if not y.exists('/miniGIS'):
            y.mkdir('/miniGIS')

        with open('./images/raw/Sentinel/S2A_MSIL1C_20220106T111441_N0301_R137_T30STE_20220106T131537.SAFE/T30STE_20220106T111441_B02.jp2', "rb") as f:
            y.upload(f, "/miniGIS/T30STE_20220106T111441_B02.jp2")
            # pass

        response = y.exists('/miniGIS/T30STE_20220106T111441_B02.jp2')
        return response
