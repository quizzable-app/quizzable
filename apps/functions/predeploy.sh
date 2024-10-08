#!/bin/bash -e

if [ -f .env ]; then
  echo ".env should not be present"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Missing: DATABASE_URL"
  exit 1
fi

echo "DATABASE_URL=$DATABASE_URL" >.env
echo "PRISMA_QUERY_ENGINE_LIBRARY=dist/libquery_engine-debian-openssl-3.0.x.so.node" >>.env

mkdir -p dist
cp ../../node_modules/prisma/libquery_engine-debian-openssl-3.0.x.so.node dist
