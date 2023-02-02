# Деплой приложения

1. выполнить из текущей директории команду (файл включён в .gitignore -> его нужно создать и вставить туда credential)

## При развёртывании
1. На сервер создать файл (Временно) secret.yml (включён в .gitignore), заполнить содержимым #TODO убрать из .gitignore, но удалить токены
2. Применить секрет
3. На сервер создать файл (Временно) ee-minigis-credential.json (включён в .gitignore), заполнить соодержимым
4. Применить kubectl create secret generic google-earth-engine-secret --from-file=MINIGIS_EARTH_ENGINE_KEY_DATA=./ee-minigis-credential.json
5. Не забыть авторизироваться в docker.hub! чтобы скачивать от туда образ arthurgo/minigis-web:1.0 docker login
2. В файле 03_minigis_pv.yml поменять hostPath на тот путь, на котором на сервере будет примонтирована папка для хранения cache
