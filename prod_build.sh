#!/bin/bash
start=$SECONDS

cd client && \
npx webpack build --mode=production

cd ../ && \
docker buildx build --push \
--platform linux/amd64 \
--tag arthurgo/minigis-web:1.0 .

end=$SECONDS
runtime=$((end - start))
today=`date +"%d-%m-%Y %T"`
echo -e "\n\n\U1F3F0 Production version"
echo -e "\n\U1F4C5 $today"
echo -e "\U231B Завершено за $runtime сек."
