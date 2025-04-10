#!/bin/bash
set -e

# Create local AWS resources using LocalStack

echo "Setting up local AWS resources..."

# Set AWS CLI to use LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export LOCALSTACK_ENDPOINT=http://localhost:4566

# Wait for LocalStack to be ready
echo "Waiting for LocalStack to be ready..."
until aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 ls > /dev/null 2>&1; do
  echo "LocalStack not ready yet, waiting..."
  sleep 2
done

echo "LocalStack is ready!"

# Create DynamoDB table for WebSocket connections
echo "Creating DynamoDB table for WebSocket connections..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT dynamodb create-table \
  --table-name websocket-connections \
  --attribute-definitions AttributeName=connectionId,AttributeType=S \
  --key-schema AttributeName=connectionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Create S3 bucket for data storage
echo "Creating S3 bucket for data storage..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 mb s3://lambda-dev-data

# Create SQS queues
echo "Creating SQS queues..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs create-queue \
  --queue-name lambda-dev-dead-letter-queue

aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs create-queue \
  --queue-name lambda-dev-processing-queue \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:lambda-dev-dead-letter-queue\",\"maxReceiveCount\":\"3\"}"
  }'

echo "Local AWS resources have been set up successfully!"
