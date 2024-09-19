#!/bin/bash -e

sudo apt-get update
sudo apt-get install -y tmux

# Install Firebase CLI
npm i -g firebase-tools