#!/bin/bash -e

if [ ! -f .env ]; then
  echo "Missing: .env"
  exit 1
fi

source .env

if [ -z "$DATABASE_URL" ]; then
  echo "Missing: DATABASE_URL"
  exit 1
fi

target_engine="lib/libquery_engine-debian-openssl-3.0.x.so.node"
if [ "$PRISMA_QUERY_ENGINE_LIBRARY" != "$target_engine" ]; then
  echo "PRISMA_QUERY_ENGINE_LIBRARY should be set to $target_engine"
  exit 1
fi

mkdir -p lib
cp ../../node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node lib

prisma generate
npm run build
