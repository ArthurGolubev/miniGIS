from loguru import logger
import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from Types import POI

from calculation.EarthEngine import EarthEngine



app = FastAPI()

@strawberry.type
class Query:
    
    @strawberry.field
    def test() -> str:
        return 'Hello World!'

    @strawberry.field
    def test_ee() -> str:
        # earth_engine()
        return '123'

    @strawberry.field
    def poi_images(poi: POI) -> list[str]:
        # logger.debug(f"{poi=}")
        names = EarthEngine().poi_images(poi)
        return names




schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/', StaticFiles(directory='../client', html=True), name='somename')

