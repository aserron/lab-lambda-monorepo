#!/bin/bash
set -e

# Stop the local development environment

echo "Stopping Docker Compose services..."
docker-compose -f docker/docker-compose.yml down

echo "Local development environment has been stopped."
