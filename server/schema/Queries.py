import strawberry
from strawberry.scalars import JSON


from calculation.EarthEngine import EarthEngine
from calculation.FileHandler import FileHandler



@strawberry.type
class Query:

    # @strawberry.field
    # def search_images(poi: Coordinates, date: Period, sensor: str = 'LC08') -> SearchImagesTM:
    #     toast_message: SearchImagesTM = EarthEngine().search_images(poi, date, sensor)
    #     return toast_message

    # @strawberry.field
    # def get_image_preview(system_index: str, sensor: str) -> PreviewTM:
    #     toast_message: PreviewTM = EarthEngine().show_images_preview(sensor=sensor, system_index=system_index)
    #     return toast_message

    # @strawberry.field
    # def available_files(self, to: str) -> JSON:
    #     response: JSON = FileHandler().available_files(to)
    #     return response

    # @strawberry.field
    # async def tree_available_files(self, info: Info) -> JSON:
    #     return FileHandler().tree_available_files()

    # @strawberry.field
    # def add_layer(self, scope: str, satellite: str, product: str, target: str) -> AddLayerTM:
    #     toast_message: AddLayerTM = FileHandler().add_layer(scope, satellite, product, target)
    #     return toast_message

    @strawberry.field
    def shp_write(self, shp_name: str, layer: JSON) -> None:
        FileHandler().save_shp(shp_name, layer)
    

    # @strawberry.field
    # def shp_save(self, shp_name: str, layer: JSON) -> None:
    #     FileHandler().shp_save(shp_name, layer)

    @strawberry.field
    def test_data(self) -> None:
        EarthEngine().test_data()

    @strawberry.field
    def get_yandex_disk_token(self) -> str:
        return FileHandler().get_yandex_disk_token()

    @strawberry.field
    def check_yandex_disk_info(self) -> str:
        return FileHandler().check_yandex_disk_info()