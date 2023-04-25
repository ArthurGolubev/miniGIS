
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, ARRAY, Column, Float, String
from sqlalchemy.dialects import postgresql
from humps import camelize, decamelize

def to_camel(string):
    return camelize(string)

def to_snake(string):
    return decamelize(string)




class SentinelMeta(SQLModel):
    mgrs_tile: str
    product_id: str
    granule_id: str
    bands: list[str]

class StackOptions(SQLModel):
    files: list[str]

class DownloadSentinel(SQLModel):
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


class KMeanOptions(SQLModel):
    file_path: str
    k: int

class MeanShiftOptions(SQLModel):
    file_path: str
    n_samples: int

class BisectingKMeanOptions(SQLModel):
    file_path: str
    k: int

class GaussianMixtureOptions(SQLModel):
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
    end_date:   str | None



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
    shp_name: str



class Token(SQLModel):
    access_token: str
    token_type: str
    
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True



class TokenData(SQLModel):
    username: str | None = None



class AutomationType(SQLModel):
    poi: Coordinates
    date: Period
    sensor: str
    bands: list[str]
    mask: GeoJSON
    alg: str
    param: int


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
    # Хорошо бы не отправлять токен яндекса, а отправлять булево значение - есть / нету
    yandex_token: str | None

    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


# временная реализация хранения алгоритмов. Proof of concept
class Algorithm(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(default=None, foreign_key="user1.id")
    poi: str
    last_file_name: str
    alg_name: str
    alg_param: int
    mask: str                                                                  # yandex disk path_name
    sensor: str
    # bands: list[str] = Field(default=None, sa_column=Column(postgresql.ARRAY(String())))
    bands: str
    start_date: str | None
    end_date: str | None
    name: str


''' -------------------------------------------User-End-------------------------------------------- '''

