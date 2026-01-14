#!/bin/bash
# Complete rebuild and verification script

set -e

echo "=== JAMAL IMOBILIARIA - Frontend Rebuild Script ==="
echo ""

cd /opt/JamalImobiliaria

echo "1. Ensuring .env.local exists with correct value..."
echo "NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api" > frontend/.env.local
cat frontend/.env.local
echo ""

echo "2. Stopping and removing old frontend container..."
docker-compose stop frontend || true
docker-compose rm -f frontend || true
docker rmi jamalimobiliaria_frontend:latest 2>/dev/null || true
echo ""

echo "3. Building frontend with --no-cache and explicit build arg..."
docker-compose build --no-cache --build-arg NEXT_PUBLIC_API_URL=https://imobiliariajamal.com/api frontend
echo ""

echo "4. Starting frontend container..."
docker-compose up -d frontend
echo ""

echo "5. Waiting for container to be ready..."
sleep 15
echo ""

echo "6. Container status:"
docker ps --filter 'name=frontend' --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo ""

echo "7. Testing site..."
sleep 5
curl -I https://imobiliariajamal.com/ 2>&1 | head -1
echo ""

echo "8. Checking for API URL in compiled code..."
docker exec jamalimobiliaria_frontend_1 find .next -type f -name '*.js' 2>/dev/null | head -5 | while read file; do
    echo "Checking $file..."
    docker exec jamalimobiliaria_frontend_1 grep -o "imobiliariajamal.com[^\"']*" "$file" 2>/dev/null | head -3 || true
done
echo ""

echo "=== Rebuild Complete! ==="
echo "Now test in your browser: https://imobiliariajamal.com/propriedades"
echo "Press Ctrl+Shift+R to hard refresh and check Console for API calls"
