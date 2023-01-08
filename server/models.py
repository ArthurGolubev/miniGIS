from sqlmodel import SQLModel
from datetime import datetime
from sqlmodel import Field





class SentinelMeta(SQLModel):
    mgrs_tile: str
    product_id: str
    granule_id: str
    bands: list[str]



class DownloadSentinel(SQLModel):
    sentinel_meta: SentinelMeta
    sensor: str
    system_index: str
    meta: str



class LandsatMeta(SQLModel):
    sensor_id: str
    path: str
    row: str
    product_id: str
    bands: list[str]



class DownloadLandsat(SQLModel):
    landsat_meta: LandsatMeta
    sensor: str
    system_index: str
    meta: str



class ToastMessage(SQLModel):
    header: str
    message: str
    datetime: datetime



class GeoJSON(SQLModel):
    geometry: dict
    properties: dict
    type: str



class ClipToMask(SQLModel):
    files: list[str]
    mask: GeoJSON



class KMeanOptions(SQLModel):
    file_path: str
    k: int



class ClassificationTM(ToastMessage):
    k: int
    file_name: str
    coordinates: list[list[float]]
    img_url: str



class SearchPreviewTM(ToastMessage):
    images: list[dict]



class Coordinates(SQLModel):
    lat: float
    lon: float



class Period(SQLModel):
    start_date: str
    end_date:   str



class SearchPreview(SQLModel):
    poi: Coordinates
    date: Period
    sensor: str = 'LC08'



class PreviewTM(ToastMessage):
    img_url: str
    system_index: str
    sensor: str



class AddLayerTM(ToastMessage):
    imgUrl: str
    meta: object



class AddLayerOptions(SQLModel):
    scope: str
    target: str
    product: str
    satellite: str



class ShpSave(SQLModel):
    shp_name: str
    layer: object



class ShpRead(SQLModel):
    shp_name: object