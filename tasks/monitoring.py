import os
import requests
from loguru import logger


def check_new_img():
    # login = os.getenv("USER_SERVICE_LOGIN", "")
    # password = os.getenv("USER_SERVICE_PASSWORD", "")
    endpoint = os.getenv("USER_SERVICE_ENDPOINT", "")
    session = requests.Session()
    monitoring_endpoint = endpoint + 'automation/monitoring-start'


    session.post(monitoring_endpoint)


if __name__ == "__main__":
    check_new_img()