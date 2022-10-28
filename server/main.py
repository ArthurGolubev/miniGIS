import gzip
import strawberry

from loguru import logger
from strawberry.fastapi import GraphQLRouter
from strawberry.scalars import JSON
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from Types import Coordinates, Images, Period


from calculation.EarthEngine import EarthEngine


app = FastAPI()

@strawberry.type
class Query:


    @strawberry.field
    def search_images(poi: Coordinates, date: Period, sensor: str = 'LC08') -> list[JSON]:
        images = EarthEngine().search_images(poi, date, sensor)
        return images


    # @strawberry.field
    # def download_images(scene_id: str, sensor: str = 'LC08', bands: list[str] = ['B4']) -> str:
    #     EarthEngine().download_images(scene_id, sensor, bands)
    #     return "success"

    @strawberry.field
    def download_images(images: list[Images]) -> str:
        logger.success('START')
        EarthEngine().download_images(images)
        return "success"

    @strawberry.field
    def read_csv() -> str:  # 
        # s = pd.read_csv('./index.csv.gz', compression='gzip')
        # logger.info(s)
        with gzip.open('./index.csv.gz', 'rb') as f:
            file_content = f.readlines()
            with open('./test.csv', 'wb') as fw:
                fw.writelines(file_content)
        return '123'


schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/', StaticFiles(directory='../client', html=True), name='somename')

