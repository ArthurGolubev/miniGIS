# Деплой приложения

#### Если в кластере нет запущеного пода с Postgres:
https://phoenixnap.com/kb/postgresql-kubernetes

## При развёртывании

1. Для начала - применить secret.yml (включён в .gitignore) из папки minigis-web - postgres читает от туда пароль для создания БД
2. В файле 03_postgres_pv.yml поменять local на тот путь, на котором на сервере будет примонтирована папка для хранения БД
3. Создать папку на сервере /home/$USER/apps/pv/minigis/postgres-data