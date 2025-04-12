#!/bin/bash
set -e

# Create local AWS resources using LocalStack

echo "Setting up local AWS resources..."

# Use the aws-local.sh script for AWS CLI commands
AWS_LOCAL="./scripts/aws-local.sh"

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until $AWS_LOCAL s3 ls > /dev/null 2>&1; do
  echo "LocalStack not ready yet, waiting..."
  sleep 2
done

echo "LocalStack is ready!"

# Create DynamoDB table for WebSocket connections
echo "Creating DynamoDB table for WebSocket connections..."
$AWS_LOCAL dynamodb create-table \
  --table-name websocket-connections \
  --attribute-definitions AttributeName=connectionId,AttributeType=S \
  --key-schema AttributeName=connectionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Create S3 bucket for data storage
echo "Creating S3 bucket for data storage..."
$AWS_LOCAL s3 mb s3://lambda-dev-data

# Create SQS queues
echo "Creating SQS queues..."
$AWS_LOCAL sqs create-queue \
  --queue-name lambda-dev-dead-letter-queue

$AWS_LOCAL sqs create-queue \
  --queue-name lambda-dev-processing-queue \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:lambda-dev-dead-letter-queue\",\"maxReceiveCount\":\"3\"}"
  }'

echo "Local AWS resources have been set up successfully!"
