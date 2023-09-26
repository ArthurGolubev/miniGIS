import pytest
from .EarthEngine import EarthEngine
from ..models import User1
from ..models import Coordinates
from ..models import Period
from ..models import SearchPreviewTM
from loguru import logger
from datetime import datetime, timedelta

@pytest.fixture
def test_user():
    return User1(
        email='123',
        id='10',
        password='',
        permissions='regular_user',
        telegram_chat_id='123',
        username='tom09',
        yandex_token='100',
        admin=False
    )

@pytest.fixture
def test_coordinates():
    return Coordinates(lat=56.01, lon=92.86)


@pytest.fixture
def test_period():
    today = datetime.now()
    return Period(
        start_date=str(today-timedelta(days=3)),
        end_date=str(today+timedelta(days=5))
        )

test_properties = {'test_cloud_cover': '10', 'test_scene_id': '10023', 'etc': '...'}

class MockImageCollection:
    @staticmethod
    def filterDate(start, end):
        return MockImageCollection

    @staticmethod
    def filterBounds(point):
        return MockImageCollection
    
    @staticmethod
    def getInfo():
        return {'features': [{
            'properties': test_properties
            }]}



def test_EarthEngine_search_preview(monkeypatch, test_user, test_coordinates, test_period):
    ee = EarthEngine(user=test_user)
    logger.debug(ee)
    
    monkeypatch.setattr("ee.ImageCollection", lambda *args: MockImageCollection)
    monkeypatch.setattr("ee.Geometry.Point", lambda *args: logger.success('mock ee.Geometry.Point'))
    result = ee.search_preview(date=test_period, poi=test_coordinates, sensor='LC08')
    img_metadata = [test_properties]

    assert isinstance(result, SearchPreviewTM)
    assert result.images == img_metadata
    assert result.operation == 'search-preview'