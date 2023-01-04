import strawberry

from pathlib import Path
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from strawberry.fastapi import GraphQLRouter
from schema.Queries import Query
from schema.Mutations import Mutation



Path('./cache').mkdir(exist_ok=True)
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


schema = strawberry.Schema(query=Query, mutation=Mutation)
graphql_app = GraphQLRouter(schema=schema, context_getter=get_context)

app.include_router(graphql_app, prefix='/api/graphql')
app.mount('/cache', StaticFiles(directory='../server/cache/'), name='images')
app.mount('/', StaticFiles(directory='../client', html=True), name='index')
