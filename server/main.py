import gzip
from multiprocessing import get_context
import strawberry

from loguru import logger
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter
from strawberry.scalars import JSON
from strawberry.types import Info

from sqlmodel import Session
from Types import Coordinates, Images, LandsatDownload, Period, SentinelDownload, ToastMessage
from calculation.EarthEngine import EarthEngine

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
    def download_images(images: list[Images]) -> str:
        logger.success('START')
        EarthEngine().download_images(images)
        return "success"

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
    def sentinel_db_update_from_csv(self, info: Info) -> str:
        EarthEngine().sentinel_db_update_from_csv(info.context["session"])
        return 'str'

    @strawberry.field
    def test_data(self) -> None:
        EarthEngine().test_data()


schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema, context_getter=get_context)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/', StaticFiles(directory='../client', html=True), name='somename')
