#!/bin/bash -e

if [ -f .env ]; then
    source .env
fi

export DATABASE_URL=$TEST_DATABASE_URL
prisma db push --force-reset
vitest
