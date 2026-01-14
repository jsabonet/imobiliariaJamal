#!/bin/bash
# Script to verify the NEXT_PUBLIC_API_URL is correctly compiled into the frontend

echo "=== Verifying Frontend Configuration ==="
echo ""

echo "1. Checking .env.local file:"
cat /opt/JamalImobiliaria/frontend/.env.local
echo ""

echo "2. Searching for API URL in compiled JavaScript:"
docker exec jamalimobiliaria_frontend_1 sh -c "find .next -type f -name '*.js' -exec grep -h 'imobiliariajamal.com' {} \; | grep -o 'https://imobiliariajamal.com[^\"]*' | sort -u"
echo ""

echo "3. Checking for localhost references:"
docker exec jamalimobiliaria_frontend_1 sh -c "find .next -type f -name '*.js' -exec grep -l 'localhost:8000' {} \;" | wc -l
echo ""

echo "4. Container image info:"
docker inspect jamalimobiliaria_frontend_1 --format='Image: {{.Image}} Created: {{.Created}}'
echo ""

echo "Done!"
