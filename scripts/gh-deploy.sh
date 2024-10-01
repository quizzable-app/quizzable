#!/bin/bash -e

GIT_REF_NAME=$(git rev-parse --abbrev-ref HEAD)

gh workflow run deploy.yaml --ref $GIT_REF_NAME

gh workflow view deploy.yaml -w
