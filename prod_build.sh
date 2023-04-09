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
echo "Завершено за $runtime сек."
