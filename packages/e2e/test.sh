#!/bin/bash -e

if [ -f .env ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
fi

if [ "$FIREBASE_AUTH_EMULATOR_HOST" == "127.0.0.1:9099" ]; then
    ../../scripts/reset-db.sh

    if tmux new -d -s e2e 2>/dev/null; then
        tmux send-keys -t e2e 'npm run dev --workspace functions > functions.log 2>&1 & tail -f functions.log' C-m
        tmux split-window -v -t e2e
        tmux send-keys -t e2e 'npm run dev --workspace web > web.log 2>&1 & tail -f web.log' C-m
        tmux select-layout -t e2e even-vertical
    fi

    curl -sS --retry 10 \
        --retry-delay 10 \
        --retry-connrefused \
        '127.0.0.1:9099'
fi

playwright test
