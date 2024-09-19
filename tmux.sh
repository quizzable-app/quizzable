#!/bin/bash -e

# https://tmuxcheatsheet.com/

op=$1

if [ "$op" == "kill" ]; then
    tmux kill-session -t dev
    exit 0
fi

if tmux new -d -s dev 2>/dev/null; then
    tmux send-keys -t dev "npx prisma studio" C-m
    tmux split-window -v -t dev
    tmux send-keys -t dev "npm run build:watch --workspace functions" C-m
    tmux select-layout -t dev even-vertical
fi

tmux attach -t dev
