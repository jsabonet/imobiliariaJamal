#!/bin/bash
cd /opt/JamalImobiliaria
git pull
docker-compose stop frontend
docker image rm -f jamalimobiliaria_frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
echo "✅ Frontend rebuild completado!"
docker-compose ps frontend
