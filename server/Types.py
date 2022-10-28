import strawberry


@strawberry.input
class Coordinates:
    lat: float
    lon: float


@strawberry.input
class Period:
    start_date: str
    end_date:   str

@strawberry.input
class Images:
    scene_id: str
    sensor: str
    bands: list[str]

