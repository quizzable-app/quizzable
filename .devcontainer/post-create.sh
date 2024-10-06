#!/bin/bash -e

# Install Dependencies
sudo apt-get update
sudo apt-get install -y tmux
npm i -g firebase-tools
npm install
npx playwright install --with-deps chromium

# .env
echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-dev?schema=public" >.env

# apps/functions/.env
echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-dev?schema=public" >apps/functions/.env
echo "PRISMA_QUERY_ENGINE_LIBRARY=../../node_modules/prisma/libquery_engine-debian-openssl-3.0.x.so.node" >>apps/functions/.env
echo "TEST_DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-test?schema=public" >>apps/functions/.env

# apps/web/.env
echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-dev?schema=public" >apps/web/.env
echo "FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_APP_ID=$QUIZZABLE_FIREBASE_APP_ID" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_API_KEY=$QUIZZABLE_FIREBASE_API_KEY" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=127.0.0.1:9099" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$QUIZZABLE_FIREBASE_PROJECT_ID" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$QUIZZABLE_FIREBASE_STORAGE_BUCKET" >>apps/web/.env
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$QUIZZABLE_FIREBASE_MESSAGING_SENDER_ID" >>apps/web/.env
echo "TEST_DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-test?schema=public" >>apps/web/.env

# packages/e2e/.env
echo "BASE_URL=http://localhost:3000" >packages/e2e/.env
echo "DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-dev?schema=public" >>packages/e2e/.env
echo "FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_APP_ID=$QUIZZABLE_FIREBASE_APP_ID" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_API_KEY=$QUIZZABLE_FIREBASE_API_KEY" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=127.0.0.1:9099" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=$QUIZZABLE_FIREBASE_PROJECT_ID" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$QUIZZABLE_FIREBASE_STORAGE_BUCKET" >>packages/e2e/.env
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$QUIZZABLE_FIREBASE_MESSAGING_SENDER_ID" >>packages/e2e/.env
echo "PRISMA_QUERY_ENGINE_LIBRARY=../../node_modules/prisma/libquery_engine-debian-openssl-3.0.x.so.node" >>packages/e2e/.env
echo "TEST_DATABASE_URL=postgresql://admin:LocalPasswordOnly@localhost:5433/quizzable-test?schema=public" >>packages/e2e/.env

# Setup Postgres
npx prisma db push --force-reset
npx prisma db seed
