#!/bin/bash
start=$SECONDS

cd client && \
npx webpack build --mode=development

cd ../ && \
docker buildx build --push \
--platform linux/amd64 \
--tag arthurgo/minigis-web:1.0 .

deploy="../kubernetes/minigis/minigis-web"
microk8s.kubectl delete -f "$deploy/05_deployment_minigis.yml"
microk8s.kubectl apply -f "$deploy/05_deployment_minigis.yml"

end=$SECONDS
runtime=$((end - start))
today=`date +"%d-%m-%Y %T"`
echo -e "\n\n\U1F4C5 $today"
echo -e "\U231B Завершено за $runtime сек."
