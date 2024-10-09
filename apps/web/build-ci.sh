#! /bin/bash -e

if [ -z "$VERCEL_TOKEN" ]; then
    echo "VERCEL_TOKEN is not set"
    exit 1
fi

cd ../../
vercel link --yes --project quizzable --token $VERCEL_TOKEN

if [ "$ENVIRONMENT" == "production" ]; then
    vercel build --yes --token $VERCEL_TOKEN --prod
else
    vercel build --yes --token $VERCEL_TOKEN
fi
