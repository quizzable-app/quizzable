#! /bin/bash -e
cd ../../
vercel link --yes --project quizzable
vercel build --yes

if [ "$GITHUB_REF_NAME" == "main" ]; then
    vercel deploy --prebuilt --prod
else
    vercel deploy --prebuilt
fi
