import strawberry

import geopandas as gpd
from loguru import logger
from datetime import datetime
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
# from fastapi.staticfiles import Mount
from strawberry.fastapi import GraphQLRouter
from strawberry.scalars import JSON
from strawberry.types import Info


from Types import Coordinates, LandsatDownload, Period, SentinelDownload, ToastMessage, GeoJSON
from calculation.EarthEngine import EarthEngine
from calculation.FileHandler import FileHandler
from calculation.Classifier import Classifier

app = FastAPI()


@app.on_event("startup")
def on_startup():
    pass
    # create_db_and_tables()

def get_session():
    pass
    # with Session(engine) as session:
    #     yield session

async def get_context(
    session=Depends(get_session),
):
    return {
        "session": session,
    }




@strawberry.type
class Query:

    @strawberry.field
    def search_images(poi: Coordinates, date: Period, sensor: str = 'LC08') -> list[JSON]:
        images = EarthEngine().search_images(poi, date, sensor)
        return images

    @strawberry.field
    def get_image_preview(system_index: str, sensor: str) -> str:
        preview = EarthEngine().show_images_preview(system_index, sensor)
        return preview

    @strawberry.field
    def download_sentinel(self, sentinel_meta: SentinelDownload) -> ToastMessage:
        logger.success("SENTINEL")
        toast_message: ToastMessage = EarthEngine().download_sentinel(sentinel_meta)
        return toast_message

    @strawberry.field
    def download_landsat(self, landsat_meta: LandsatDownload) -> ToastMessage:
        logger.success("LANDSAT")
        toast_message: ToastMessage = EarthEngine().download_landsat(landsat_meta)
        return toast_message

    @strawberry.field
    def available_files(self, to: str) -> JSON:
        response: JSON = FileHandler().available_files(to)
        return response

    @strawberry.field
    def clip_to_mask(self, files: list[str], geojson: GeoJSON) -> ToastMessage:
        toast_message: ToastMessage = FileHandler().clip_to_mask(files, mask=geojson)
        return toast_message
    
    @strawberry.field
    def stack_bands(self, files: list[str]) -> ToastMessage:
        toast_message: ToastMessage = FileHandler().stack_bands(files)
        return toast_message

    @strawberry.field
    def classify_k_mean(self, file_path: str, k: int) -> ToastMessage:
        toast_message: ToastMessage = Classifier().k_mean(file_path, k)
        return toast_message

    @strawberry.field
    def get_classification_layer(self, file_path: str) -> JSON:
        res = FileHandler().get_classification_layer(file_path)
        return res 


    @strawberry.field
    def test_data(self) -> None:
        EarthEngine().test_data()


schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema, context_getter=get_context)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/images', StaticFiles(directory='../server/images/'), name='images')
app.mount('/', StaticFiles(directory='../client', html=True), name='index')
