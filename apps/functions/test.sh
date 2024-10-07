#!/bin/bash -e

if [ -f .env ]; then
    source .env
fi

if [ -z "$TEST_DATABASE_URL" ]; then
    echo "TEST_DATABASE_URL is not set"
    exit 1
fi

export TEST_DATABASE_URL
export DATABASE_URL=$TEST_DATABASE_URL
prisma db push --force-reset
vitest
