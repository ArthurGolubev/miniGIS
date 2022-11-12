import strawberry
from datetime import datetime
from strawberry.scalars import JSON



@strawberry.input
class Coordinates:
    lat: float
    lon: float


@strawberry.input
class Period:
    start_date: str
    end_date:   str

@strawberry.input
class Images:
    scene_id: str
    sensor: str
    bands: list[str]

@strawberry.input
class LandsatDownload:
    sensor_id: str
    path: str
    row: str
    product_id: str
    bands: list[str]

@strawberry.input
class SentinelDownload:
    mgrs_tile: str
    product_id: str
    granule_id: str
    bands: list[str]

@strawberry.type
class ToastMessage:
    header: str
    message: str
    datetime: datetime

@strawberry.input
class GeoJSON:
    geometry: JSON
    properties: JSON
    type: str
