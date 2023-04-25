#!/bin/bash
start=$SECONDS

cd ../client && \
npx webpack build --mode=development

cd ../dev_env && \
docker buildx build \
--push \
--platform linux/amd64 \
--tag arthurgo/minigis-web:dev .


microk8s.kubectl delete -f dev_minigis_deploy.yml
microk8s.kubectl apply -f dev_minigis_deploy.yml

end=$SECONDS
runtime=$((end - start))
today=`date +"%d-%m-%Y %T"`
echo -e "\n\n\U1F5FF Development version"
echo -e "\n\U1F4C5 $today"
echo -e "\U231B Завершено за $runtime сек."
