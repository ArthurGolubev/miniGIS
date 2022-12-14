
from datetime import datetime
from sqlmodel import Field, SQLModel

from humps import camelize

def to_camel(string):
    return camelize(string)



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



class Token(SQLModel):
    access_token: str
    token_type: str
    
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True



class TokenData(SQLModel):
    username: str | None = None



class User(SQLModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None



class UserInDB(User):
    hashed_password: str




class Hero(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: int | None = Field(default=None, index=True)


''' -------------------------------------------User-Start------------------------------------------ '''

class UserBase(SQLModel):
    username: str = Field(index=True)
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


''' -------------------------------------------User-End-------------------------------------------- '''

