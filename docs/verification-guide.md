# Verification and Testing Guide

This guide explains the verification and testing features available in the project for ensuring that the local development environment is set up correctly and working as expected.

## Overview

Verification and testing are crucial parts of our development workflow. We have several scripts and tools to help verify:

1. The local development environment is running correctly
2. AWS resources are properly created in LocalStack
3. Lambda functions can be deployed and invoked
4. The entire system works end-to-end

## Verification Scripts

### 1. Environment Verification Script

The main verification script is `scripts/verify-environment.sh`, which performs a comprehensive check of the local development environment.

```bash
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
```

To run this script:

```bash
./scripts/verify-environment.sh
```

Or use the npm script:

```bash
pnpm run verify:local
```

### 2. AWS Local Script

The `scripts/aws-local.sh` script is used to run AWS CLI commands against LocalStack. It's a key tool for verification as it allows us to check the state of AWS resources in LocalStack.

```bash
#!/bin/bash
set -e

# Run AWS CLI commands against LocalStack

# Check if a command was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <aws-command>"
  echo "Example: $0 s3 ls"
  exit 1
fi

# Set AWS CLI to use LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export LOCALSTACK_ENDPOINT=http://localhost:4566

# Run the AWS CLI command with LocalStack endpoint
aws --endpoint-url=$LOCALSTACK_ENDPOINT "$@"
```

To use this script:

```bash
./scripts/aws-local.sh <aws-command>
```

Or use the npm script:

```bash
pnpm run aws:local <aws-command>
```

### 3. Lambda Testing Script

The `scripts/test-lambda.sh` script is used to test Lambda functions deployed to LocalStack.

```bash
#!/bin/bash
set -e

# Test Lambda functions locally

# Check if a function name was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <function-name> [event-file]"
  echo "Example: $0 hello-function events/hello.json"
  exit 1
fi

FUNCTION_NAME=$1
EVENT_FILE=${2:-events/default.json}

# Use the aws-local.sh script for AWS CLI commands
AWS_LOCAL="./scripts/aws-local.sh"

# Check if LocalStack is running
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
  echo "LocalStack is not running. Please start the local environment first."
  exit 1
fi

# Check if the event file exists
if [ ! -f "$EVENT_FILE" ]; then
  echo "Event file $EVENT_FILE does not exist."
  echo "Creating a default event file..."
  mkdir -p events
  echo '{"key1": "value1", "key2": "value2", "key3": "value3"}' > events/default.json
  EVENT_FILE=events/default.json
fi

# Invoke the Lambda function
echo "Invoking Lambda function $FUNCTION_NAME with event from $EVENT_FILE..."
$AWS_LOCAL lambda invoke \
  --function-name $FUNCTION_NAME \
  --payload file://$EVENT_FILE \
  --cli-binary-format raw-in-base64-out \
  output.json

# Display the result
echo "Lambda function response:"
cat output.json
rm output.json

echo "Lambda function test completed!"
```

To use this script:

```bash
./scripts/test-lambda.sh <function-name> [event-file]
```

Or use the npm script:

```bash
pnpm run test:lambda <function-name> [event-file]
```

## Verification Steps

### 1. Docker and LocalStack Verification

The first step in verification is to ensure that Docker is running and LocalStack is available:

```bash
# Check if Docker is running
docker info

# Check if LocalStack is running
curl http://localhost:4566/_localstack/health
```

If LocalStack is not running, you can start it with:

```bash
pnpm run start:local
```

### 2. AWS Resources Verification

Once LocalStack is running, you can verify that the required AWS resources are created:

```bash
# Check DynamoDB tables
pnpm run aws:local dynamodb list-tables

# Check S3 buckets
pnpm run aws:local s3 ls

# Check SQS queues
pnpm run aws:local sqs list-queues

# Check Lambda functions
pnpm run aws:local lambda list-functions
```

### 3. Lambda Function Verification

To verify that Lambda functions are working correctly, you can invoke them with test events:

```bash
# Test HTTP API Lambda
pnpm run test:lambda hello-function events/hello.json

# Test WebSocket Lambda
pnpm run test:lambda connect-function events/websocket-connect.json

# Test Event-Driven Lambda
pnpm run test:lambda s3-processor-function events/s3-event.json
```

### 4. End-to-End Verification

For end-to-end verification, you can use AWS SAM to run the Lambda functions locally with API Gateway:

```bash
# Build the project with SAM
pnpm run sam:build

# Start the local API
pnpm run sam:local
```

Then you can test the API endpoints:

```bash
curl http://localhost:3000/hello
```

## Test Events

We have several test event files in the `events` directory for testing different types of Lambda functions:

### 1. HTTP API Events

`events/hello.json`:
```json
{
  "httpMethod": "GET",
  "path": "/hello",
  "queryStringParameters": {
    "name": "World"
  },
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null,
  "isBase64Encoded": false
}
```

### 2. WebSocket Events

`events/websocket-connect.json`:
```json
{
  "requestContext": {
    "connectionId": "123456789",
    "domainName": "localhost",
    "stage": "dev"
  },
  "headers": {
    "Host": "localhost"
  },
  "isBase64Encoded": false
}
```

`events/websocket-message.json`:
```json
{
  "requestContext": {
    "connectionId": "123456789",
    "domainName": "localhost",
    "stage": "dev"
  },
  "body": "{\"action\":\"message\",\"message\":\"Hello, WebSocket!\"}",
  "isBase64Encoded": false
}
```

### 3. Event-Driven Events

`events/s3-event.json`:
```json
{
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-1",
      "eventTime": "2023-01-01T12:00:00.000Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "responseElements": {
        "x-amz-request-id": "EXAMPLE123456789",
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "testConfigRule",
        "bucket": {
          "name": "lambda-dev-data",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          },
          "arn": "arn:aws:s3:::lambda-dev-data"
        },
        "object": {
          "key": "test-file.txt",
          "size": 1024,
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901"
        }
      }
    }
  ]
}
```

`events/sqs-event.json`:
```json
{
  "Records": [
    {
      "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      "receiptHandle": "MessageReceiptHandle",
      "body": "{\"type\":\"USER_CREATED\",\"userId\":\"123\"}",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1523232000000",
        "SenderId": "123456789012",
        "ApproximateFirstReceiveTimestamp": "1523232000001"
      },
      "messageAttributes": {},
      "md5OfBody": "7b270e59b47ff90a553787216d55d91d",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:lambda-dev-processing-queue",
      "awsRegion": "us-east-1"
    }
  ]
}
```

## Troubleshooting Verification Issues

### 1. Docker Issues

If Docker is not running or not accessible:
- Check that Docker Desktop is installed and running
- Verify that the Docker daemon is running
- Check Docker permissions

### 2. LocalStack Issues

If LocalStack is not starting or not accessible:
- Check Docker logs: `docker logs lambda-dev-localstack`
- Verify port 4566 is not in use by another application
- Check that the Docker network is properly configured

### 3. AWS CLI Issues

If AWS CLI commands are failing:
- Verify AWS CLI is installed: `aws --version`
- Check AWS credentials are set correctly
- Ensure the endpoint URL is correct: `--endpoint-url=http://localhost:4566`

### 4. Lambda Function Issues

If Lambda functions are not deploying or invoking correctly:
- Check that the function code is built: `pnpm run build`
- Verify the handler path is correct
- Check the function role and permissions
- Look for errors in the Lambda function logs

## Best Practices for Verification

1. **Run Verification Regularly**: Run the verification script regularly during development to catch issues early.

2. **Automate Verification**: Include verification in your development workflow and CI/CD pipeline.

3. **Test All Lambda Types**: Verify all types of Lambda functions (HTTP API, WebSocket, Event-driven).

4. **Check Resource Creation**: Verify that all required AWS resources are created in LocalStack.

5. **End-to-End Testing**: Perform end-to-end testing to ensure the entire system works together.

## Conclusion

Verification and testing are essential parts of our development workflow. By using the scripts and tools provided in this guide, you can ensure that your local development environment is set up correctly and working as expected.

For more information, refer to:
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS CLI Documentation](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
