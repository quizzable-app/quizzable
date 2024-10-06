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

target_engine="dist/libquery_engine-debian-openssl-3.0.x.so.node"
if [ "$PRISMA_QUERY_ENGINE_LIBRARY" != "$target_engine" ]; then
  echo "PRISMA_QUERY_ENGINE_LIBRARY should be set to $target_engine"
  exit 1
fi

mkdir -p dist
cp ../../node_modules/prisma/libquery_engine-debian-openssl-3.0.x.so.node dist
