#! /bin/bash -e

if [ -z "$VERCEL_TOKEN" ]; then
    echo "VERCEL_TOKEN is not set"
    exit 1
fi

cd ../../

if [ "$ENVIRONMENT" == "production" ]; then
    vercel deploy --prebuilt --prod --token $VERCEL_TOKEN
else
    vercel deploy --prebuilt --token $VERCEL_TOKEN
fi
