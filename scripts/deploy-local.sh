#!/bin/bash
set -e

# Deploy Lambda functions to LocalStack

echo "Deploying Lambda functions to LocalStack..."

# Set AWS CLI to use LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export LOCALSTACK_ENDPOINT=http://localhost:4566

# Check if LocalStack is running
if ! curl -s $LOCALSTACK_ENDPOINT/_localstack/health > /dev/null; then
  echo "LocalStack is not running. Please start the local environment first."
  exit 1
fi

# Build the project
echo "Building the project..."
pnpm run build

# Deploy HTTP API Lambda functions
echo "Deploying HTTP API Lambda functions..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name hello-function \
  --runtime nodejs18.x \
  --handler dist/handlers/hello.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/http-api/dist/handlers/hello.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=hello-service,POWERTOOLS_METRICS_NAMESPACE=HelloService}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

# Deploy WebSocket Lambda functions
echo "Deploying WebSocket Lambda functions..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name connect-function \
  --runtime nodejs18.x \
  --handler dist/handlers/connect.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/websocket/dist/handlers/connect.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=websocket-service,POWERTOOLS_METRICS_NAMESPACE=WebSocketService,CONNECTIONS_TABLE=websocket-connections}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name disconnect-function \
  --runtime nodejs18.x \
  --handler dist/handlers/disconnect.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/websocket/dist/handlers/disconnect.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=websocket-service,POWERTOOLS_METRICS_NAMESPACE=WebSocketService,CONNECTIONS_TABLE=websocket-connections}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name message-function \
  --runtime nodejs18.x \
  --handler dist/handlers/message.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/websocket/dist/handlers/message.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=websocket-service,POWERTOOLS_METRICS_NAMESPACE=WebSocketService,CONNECTIONS_TABLE=websocket-connections}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

# Deploy Event-driven Lambda functions
echo "Deploying Event-driven Lambda functions..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name s3-processor-function \
  --runtime nodejs18.x \
  --handler dist/handlers/s3-processor.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/events/dist/handlers/s3-processor.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=s3-processor-service,POWERTOOLS_METRICS_NAMESPACE=S3ProcessorService}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

aws --endpoint-url=$LOCALSTACK_ENDPOINT lambda create-function \
  --function-name sqs-consumer-function \
  --runtime nodejs18.x \
  --handler dist/handlers/sqs-consumer.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/events/dist/handlers/sqs-consumer.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=sqs-consumer-service,POWERTOOLS_METRICS_NAMESPACE=SQSConsumerService}" \
  --timeout 10 \
  --memory-size 128 \
  --update-config true \
  2>&1 | grep -v "ResourceConflictException"

# Create API Gateway
echo "Creating API Gateway..."
aws --endpoint-url=$LOCALSTACK_ENDPOINT apigateway create-rest-api \
  --name lambda-dev-api \
  2>&1 | grep -v "ConflictException"

# TODO: Configure API Gateway routes and integrations

echo "Lambda functions have been deployed to LocalStack!"
