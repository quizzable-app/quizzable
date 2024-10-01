#! /bin/bash -e

if [ -z "$VERCEL_TOKEN" ]; then
    echo "VERCEL_TOKEN is not set"
    exit 1
fi

cd ../../
vercel link --yes --project quizzable --token $VERCEL_TOKEN
vercel build --yes --token $VERCEL_TOKEN

if [ "$GITHUB_REF_NAME" == "main" ]; then
    vercel deploy --prebuilt --prod --token $VERCEL_TOKEN
else
    vercel deploy --prebuilt --token $VERCEL_TOKEN
fi
