import os
from sqlmodel import Session
from sqlmodel import SQLModel, create_engine


USER = os.getenv("POSTGRES_USER")
PASSWORD = os.getenv("POSTGRES_PASSWORD")
HOST = os.getenv("POSTGRES_HOST")

SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:5432/{USER}"
# SQLALCHEMY_DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@localhost:5432/{USER}" # Kubernetes
engine = create_engine(SQLALCHEMY_DATABASE_URL)


# sqlite_file_name = "db.db"
# sqlite_url = f"sqlite:///{sqlite_file_name}"
# connect_args = {"check_same_thread": False}
# engine = create_engine(sqlite_url, connect_args=connect_args)




def get_session():
    with Session(engine) as session:
        yield session




# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)