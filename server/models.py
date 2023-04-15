
from datetime import datetime
from sqlmodel import Field, SQLModel

from humps import camelize, decamelize

def to_camel(string):
    return camelize(string)

def to_snake(string):
    return decamelize(string)



class WebSocket(SQLModel):
    token: str
    operation: str

class SentinelMeta(SQLModel):
    mgrs_tile: str
    product_id: str
    granule_id: str
    bands: list[str]

class StackOptions(WebSocket):
    files: list[str]

class DownloadSentinel(WebSocket):
    sentinel_meta: SentinelMeta
    sensor: str
    system_index: str
    meta: str
    
    # class Config:
    #     alias_generator = to_snake
        # allow_population_by_field_name = True



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
    operation: str



class GeoJSON(SQLModel):
    geometry: dict
    properties: dict
    type: str



class ClipToMask(SQLModel):
    files: list[str]
    mask: GeoJSON


class MeanShiftOptions(SQLModel):
    n_samples: int

class KMeanOptions(WebSocket):
    file_path: str
    k: int

class MeanShiftOptions(SQLModel):
    file_path: str
    n_samples: int

class BisectingKMeanOptions(WebSocket):
    file_path: str
    k: int

class GaussianMixtureOptions(WebSocket):
    file_path: str
    n_components: int

class ClassificationTM(ToastMessage):
    file_name: str
    coordinates: list[list[float]]
    img_url: str

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True




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

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True



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



class Token(SQLModel):
    access_token: str
    token_type: str
    
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True



class TokenData(SQLModel):
    username: str | None = None


''' -------------------------------------------User-Start------------------------------------------ '''

class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)


class UserAuthorization(SQLModel):
    username: str
    password: str


class User1(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    yandex_token: str | None = None
    password: str


class User1Create(UserBase):
    password: str


class User1Read(UserBase):
    id: int
    yandex_token: str | None

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True



''' -------------------------------------------User-End-------------------------------------------- '''

