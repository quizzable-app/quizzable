#!/bin/bash -e

if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ -z "$TEST_DATABASE_URL" ]; then
    echo "TEST_DATABASE_URL is not set"
    exit 1
fi

export DATABASE_URL=$TEST_DATABASE_URL
prisma db push --force-reset
vitest
