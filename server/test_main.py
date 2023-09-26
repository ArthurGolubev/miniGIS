from fastapi.testclient import TestClient
from loguru import logger
from .main import app
# 

def test_read_main(monkeypatch):
    # monkeypatch.setattr("ee.Initialize", lambda _: logger.success('ee init'))

    client = TestClient(app)

    response = client.get('/api/v2-rest')
    logger.debug(response)
