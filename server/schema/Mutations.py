import strawberry

from Types import GeoJSON
from Types import ToastMessage
from Types import LandsatDownload
from Types import ClassificationTM
from Types import SentinelDownload

from calculation.Classifier import Classifier
from calculation.EarthEngine import EarthEngine
from calculation.FileHandler import FileHandler


@strawberry.type
class Mutation:

    @strawberry.mutation
    def download_sentinel(self, sentinel_meta: SentinelDownload, sensor: str, system_index: str, metadata: str) -> ToastMessage:
        toast_message: ToastMessage = EarthEngine().download_sentinel(sentinel_meta, sensor=sensor, system_index=system_index, metadata=metadata)
        return toast_message

    @strawberry.mutation
    def download_landsat(self, landsat_meta: LandsatDownload, sensor: str, system_index:str, metadata: str) -> ToastMessage:
        toast_message: ToastMessage = EarthEngine().download_landsat(landsat_meta, sensor=sensor, system_index=system_index, metadata=metadata)
        return toast_message

    @strawberry.mutation
    def clip_to_mask(self, files: list[str], geoJSONs: list[GeoJSON]) -> ToastMessage:
        toast_message: ToastMessage = FileHandler().clip_to_mask(files, mask=geoJSONs)
        return toast_message

    @strawberry.mutation
    def stack_bands(self, files: list[str]) -> ToastMessage:
        toast_message: ToastMessage = FileHandler().stack_bands(files)
        return toast_message

    @strawberry.mutation
    def classify_k_mean(self, file_path: str, k: int) -> ClassificationTM:
        toast_message: ClassificationTM = Classifier().k_mean(file_path, k)
        return toast_message
