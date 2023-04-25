#!/bin/bash
start=$SECONDS

docker buildx build \
--push \
--platform linux/amd64 \
--tag arthurgo/minigis-tasks:0.1 .


deploy="/home/arthur/dev/kubernetes/minigis/minigis-tasks"
microk8s.kubectl delete -f "$deploy/01_minigis_tasks.yml"
microk8s.kubectl apply -f "$deploy/01_minigis_tasks.yml"

end=$SECONDS
runtime=$((end - start))
today=`date +"%d-%m-%Y %T"`
echo -e "\n\n\U1F5FF Development version"
echo -e "\n\U1F4C5 $today"
echo -e "\U231B Завершено за $runtime сек."
