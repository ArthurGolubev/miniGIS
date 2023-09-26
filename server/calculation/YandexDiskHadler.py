import os
import yadisk


from ..models import User1


class YandexDiskHandler:
    def __init__(self, user: User1 | None = None) -> None:
        if user: self.y = yadisk.YaDisk(token=user.yandex_token)



    def _make_yandex_dir_recursively(self, path):
        path = path.split('/')
        cur_dir = ''
        for cdir in path[1:]:
            cur_dir += f'/{cdir}'
            if not self.y.exists(cur_dir):
                self.y.mkdir(cur_dir)



    def get_yandex_disk_auth_url(self):
        return yadisk.YaDisk(id=os.getenv("YANDEX_DISK_CLIENT_ID_APP_MINIGIS")).get_auth_url(type="code")




    def get_yandex_disk_token(self, code):
        try:
            token = yadisk.YaDisk(
                id=os.getenv("YANDEX_DISK_CLIENT_ID_APP_MINIGIS"),
                secret=os.getenv('YANDEX_API_CLIENT_SECRET')
            ).get_token(code=code).access_token
        except:
            token = None
        return token
    