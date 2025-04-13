#!/bin/bash
set -e

# Verify the local development environment

echo "Starting verification of the local development environment..."

# Check if Docker is running
echo "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again."
  exit 1
fi
echo "✅ Docker is running"

# Check if the local environment is running
echo "Checking if the local environment is running..."
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
  echo "Local environment is not running. Starting it now..."
  ./scripts/start-local.sh
else
  echo "✅ Local environment is already running"
fi

# Build the project
echo "Building the project..."
pnpm run build
echo "✅ Project built successfully"

# Deploy Lambda functions to LocalStack
echo "Deploying Lambda functions to LocalStack..."
./scripts/deploy-local.sh
echo "✅ Lambda functions deployed successfully"

# Test HTTP API Lambda function
echo "Testing HTTP API Lambda function..."
./scripts/test-lambda.sh hello-function events/hello.json
echo "✅ HTTP API Lambda function tested successfully"

# Test WebSocket Lambda function
echo "Testing WebSocket Lambda function..."
./scripts/test-lambda.sh connect-function events/websocket-connect.json
echo "✅ WebSocket Lambda function tested successfully"

# Test Event-Driven Lambda function
echo "Testing Event-Driven Lambda function..."
./scripts/test-lambda.sh s3-processor-function events/s3-event.json
echo "✅ Event-Driven Lambda function tested successfully"

# Check AWS resources
echo "Checking AWS resources..."
echo "DynamoDB tables:"
./scripts/aws-local.sh dynamodb list-tables
echo "S3 buckets:"
./scripts/aws-local.sh s3 ls
echo "SQS queues:"
./scripts/aws-local.sh sqs list-queues
echo "Lambda functions:"
./scripts/aws-local.sh lambda list-functions
echo "✅ AWS resources verified successfully"

echo "Verification completed successfully! The local development environment is working correctly."
echo "You can now proceed with development."
