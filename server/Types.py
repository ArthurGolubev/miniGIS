import strawberry


@strawberry.input
class Coordinates:
    lat: float
    lon: float


@strawberry.input
class Period:
    start_date: str
    end_date:   str


