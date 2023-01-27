#### Создать секрет из файла

1. выполнить из текущей директории команду (файл включён в .gitignore -> его нужно создать и вставить туда credential)

#### вариант с чтением из файла

kubectl create secret generic google-earth-engine-secret --from-file=MINIGIS_EARTH_ENGINE_KEY_DATA=./ee-minigis-credential.json