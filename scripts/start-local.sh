#!/bin/bash
set -e

# Start the local development environment

# Start Docker Compose services
echo "Starting Docker Compose services..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until curl -s http://localhost:4566/_localstack/health | grep -q "\"s3\": \"running\""; do
  echo "LocalStack not ready yet, waiting..."
  sleep 2
done

echo "LocalStack is ready!"

# Set up local AWS resources
echo "Setting up local AWS resources..."
./scripts/setup-local.sh

echo "Local development environment is up and running!"
echo "LocalStack UI: http://localhost:4566/_localstack/ui"
echo "DynamoDB Admin: http://localhost:8001"
echo "S3 Explorer: http://localhost:8002"
