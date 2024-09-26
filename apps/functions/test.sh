#!/bin/bash -e

if [ -f .env ]; then
    source .env
fi

export TESTING=true
export TEST_DATABASE_URL
export DATABASE_URL=$TEST_DATABASE_URL
prisma db push --force-reset
vitest
