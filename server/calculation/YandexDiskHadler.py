import os
import yadisk
from pathlib import Path


class YandexDiskHandler:
    def __init__(self) -> None:
        self.y = yadisk.YaDisk(token=os.getenv('YANDEX_TOKEN'))
        Path('./cache').mkdir(parents=True, exist_ok=True)

    def _make_yandex_dir_recursively(self, path):
        path = path.split('/')
        cur_dir = ''
        for cdir in path[1:]:
            cur_dir += f'/{cdir}'
            if not self.y.exists(cur_dir):
                self.y.mkdir(cur_dir)
