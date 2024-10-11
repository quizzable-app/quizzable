#!/bin/bash -e

if [[ -f .env && $LOAD_ENV != "false" ]]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is not set"
    exit 1
fi

FIREBASE_PROJECT_ID=$(firebase use)
echo "Using Firebase project $FIREBASE_PROJECT_ID"
echo "Using database "${DATABASE_URL#*@}""

npx prisma db push --force-reset
npx prisma db seed

# Reset Firebase emulator
if ! curl -X DELETE http://127.0.0.1:9099/emulator/v1/projects/$FIREBASE_PROJECT_ID/accounts; then
    echo "Failed to reset Firebase emulator, deleting stored data"
    rm -rfv apps/functions/data
fi
