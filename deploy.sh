#!/bin/bash -e

if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

times=0
while ! npx prisma db push; do
    times=$(($times + 1))
    if [ $times -gt 5 ]; then
        echo "Failed to push database after 5 retries"
        exit 1
    fi
    echo "Failed to push database"
    echo "Retrying in 5 seconds..."
    sleep 5
done

turbo run deploy --env-mode=loose
