#!/bin/bash

# Pull the latest code from the master branch
git pull origin master

# Build and start the containers using Docker Compose
docker compose up -d --build
