#!/bin/sh

# set documentation:
# http://pubs.opengroup.org/onlinepubs/009695399/utilities/set.html
set -x # Trace of executed commands
set -e # Exit script if command fails

# Deploy web applications
docker exec oryxeditorextension_web_1 ant deploy-all

# Deploy database schema
docker exec oryxeditorextension_web_1 ant create-schema
