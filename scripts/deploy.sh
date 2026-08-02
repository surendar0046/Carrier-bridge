#!/usr/bin/env bash
echo "Deploying Career Bridge to Production..."
docker-compose -f infrastructure/docker/docker-compose.prod.yml up -d --build
