#!/bin/sh

# set documentation:
# http://pubs.opengroup.org/onlinepubs/009695399/utilities/set.html
set -x # Trace of executed commands
set -e # Exit script if command fails

# "Create and start containers" in detached mode
docker-compose up -d

# Build web applications
docker exec oryxeditorextension_web_1 ant build-all

# Deploy web applications
docker exec oryxeditorextension_web_1 ant deploy-all
