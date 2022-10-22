import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

@strawberry.type
class Query:
    
    @strawberry.field
    def test() -> str:
        return 'Hello World!'



schema = strawberry.Schema(query=Query)
graphql_app = GraphQLRouter(schema=schema)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/', StaticFiles(directory='../client', html=True), name='somename')

