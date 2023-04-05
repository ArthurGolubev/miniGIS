#!/bin/bash
docker buildx build --push \
--platform linux/amd64 \
--tag arthurgo/minigis-web:1.0 .
