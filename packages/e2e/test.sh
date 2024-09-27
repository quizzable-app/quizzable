#!/bin/bash -e
export DATABASE_URL=$TEST_DATABASE_URL
prisma db push --force-reset
prisma db seed

if tmux new -d -s e2e 2>/dev/null; then
    tmux send-keys -t e2e 'npm run e2e --workspace functions > functions.log 2>&1 & tail -f functions.log' C-m
    tmux split-window -v -t e2e
    tmux send-keys -t e2e 'npm run e2e --workspace web > web.log 2>&1 & tail -f web.log' C-m
    tmux select-layout -t e2e even-vertical
fi

curl -sS --retry 10 \
    --retry-delay 10 \
    --retry-connrefused \
    '127.0.0.1:9099'

curl -X DELETE http://127.0.0.1:9099/emulator/v1/projects/$FIREBASE_PROJECT_ID/accounts
playwright test
