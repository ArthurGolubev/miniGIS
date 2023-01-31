# Деплой приложения

#### Если в кластере нет запущеного пода с Postgres:
https://phoenixnap.com/kb/postgresql-kubernetes

## При развёртывании

1. Для начала - применить secret.yml (включён в .gitignore) из папки minigis-web - postgres читает от туда пароль для создания БД
2. В файле 02_postgres_pv.yml поменять hostPath на тот путь, на котором на сервере будет примонтирована папка для хранения БД