#!/bin/bash -e

sudo apt-get update
sudo apt-get install -y tmux

# Install Dependencies
npm i -g firebase-tools
npm install

echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@postgres/quizzable-dev?schema=public" >.env

echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@postgres/quizzable-dev?schema=public" >apps/functions/.env
echo "PRISMA_QUERY_ENGINE_LIBRARY=../../node_modules/.prisma/client/libquery_engine-debian-openssl-1.1.x.so.node" >>apps/functions/.env

echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@postgres/quizzable-dev?schema=public" >apps/web/.env
echo "FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_APP_ID=$QUIZZABLE_FIREBASE_APP_ID" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_API_KEY=$QUIZZABLE_FIREBASE_API_KEY" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=127.0.0.1:9099" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$QUIZZABLE_FIREBASE_PROJECT_ID" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$QUIZZABLE_FIREBASE_STORAGE_BUCKET" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$QUIZZABLE_FIREBASE_MESSAGING_SENDER_ID" >>apps/web/.env

npx prisma db push --force-reset
npx prisma db seed
