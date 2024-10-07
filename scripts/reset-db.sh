#!/bin/bash -e

FIREBASE_PROJECT_ID=$(firebase use)

npx prisma db push --force-reset
npx prisma db seed

# Reset Firebase emulator
if ! curl -X DELETE http://127.0.0.1:9099/emulator/v1/projects/$FIREBASE_PROJECT_ID/accounts; then
    echo "Failed to reset Firebase emulator, deleting stored data"
    rm -rfv apps/functions/data
fi
