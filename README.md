# miniGIS v1

---

### Техническое задание
##### В первой версии
Приложение должно иметь следующие возможности:

- указывать точку на местности
- показать списком доступные снимки этой местности
- отобразить привью выбранного снимка
- выделить область интереса для маски кадрирования
- кадрирование
- классификация без учителя (k-mean)
- отобразить результаты классификации
- авторизацию пользователя
- интеграцию пользователя с его Яндекс диском для хранения результатов обработки

### Дополнительно
##### Во второй версии
- выделить область интереса для обучающей выборки
- провести классификацию с учителем
- отобразить матрицу запутанности
- отобразить статистику
- провести анализ изображения по разным индексам
- отобразить результаты индексного анализа
- дополнительные методы и алгормтмы классификации без учителя
- отправка уведомлений пользователя через телеграмм-бот

### Стек технологий

##### Client side
- React
- Apollo Client
- Bootstrap
- leaflet
- geoman-io

##### Server side
- FastAPI
- SQLmodel
- PostgreSQL






### Развёртывание
Развёртывание храниться в отдельном приватном репозитории rasasi-kubernetes