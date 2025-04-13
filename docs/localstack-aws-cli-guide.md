# LocalStack and AWS CLI Configuration Guide

This guide explains how to set up and configure LocalStack and AWS CLI for local development of AWS Lambda functions.

## Prerequisites

- Docker Desktop installed and running
- AWS CLI installed
- Node.js and pnpm installed

## LocalStack Setup

### 1. Docker Compose Configuration

LocalStack runs as a Docker container and provides local emulation of AWS services. Here's the Docker Compose configuration we use:

```yaml
version: '3.8'

services:
  localstack:
    container_name: lambda-dev-localstack
    image: localstack/localstack:latest
    ports:
      - "4566:4566"            # LocalStack Gateway
      - "4510-4559:4510-4559"  # external services port range
    environment:
      - DEBUG=${DEBUG-}
      - DOCKER_HOST=unix:///var/run/docker.sock
      - LAMBDA_EXECUTOR=${LAMBDA_EXECUTOR-}
      - LOCALSTACK_API_KEY=${LOCALSTACK_API_KEY-}  # only required for Pro
      - PERSISTENCE=${PERSISTENCE-}
      - SERVICES=lambda,apigateway,dynamodb,s3,sqs,sns,cloudwatch,iam,logs
      - AWS_DEFAULT_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
      - HOSTNAME_EXTERNAL=localstack
      - LS_LOG=trace
    volumes:
      - "${LOCALSTACK_VOLUME_DIR:-./volume}:/var/lib/localstack"
      - "/var/run/docker.sock:/var/run/docker.sock"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4566/_localstack/health"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### 2. Starting LocalStack

To start LocalStack, run:

```bash
docker-compose -f docker/docker-compose.yml up -d
```

Or use our script:

```bash
pnpm run start:local
```

### 3. Verifying LocalStack is Running

Check if LocalStack is running and healthy:

```bash
curl http://localhost:4566/_localstack/health
```

You should see a JSON response with the status of all AWS services.

## AWS CLI Configuration

### 1. AWS Credentials

When working with LocalStack, you need to configure AWS CLI to use dummy credentials:

```bash
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
aws configure set region us-east-1
```

### 2. Endpoint Configuration

The most important part is to configure AWS CLI to use the LocalStack endpoint instead of the real AWS services:

```bash
aws --endpoint-url=http://localhost:4566 <command>
```

For example:

```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```

### 3. Simplifying AWS CLI Usage with LocalStack

To avoid typing the endpoint URL every time, we created a helper script (`scripts/aws-local.sh`):

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

Make the script executable:

```bash
chmod +x scripts/aws-local.sh
```

Now you can use it like this:

```bash
./scripts/aws-local.sh s3 ls
```

Or with our npm script:

```bash
pnpm run aws:local s3 ls
```

## Setting Up AWS Resources in LocalStack

### 1. DynamoDB Tables

Create a DynamoDB table:

```bash
./scripts/aws-local.sh dynamodb create-table \
  --table-name websocket-connections \
  --attribute-definitions AttributeName=connectionId,AttributeType=S \
  --key-schema AttributeName=connectionId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 2. S3 Buckets

Create an S3 bucket:

```bash
./scripts/aws-local.sh s3 mb s3://lambda-dev-data
```

### 3. SQS Queues

Create SQS queues:

```bash
./scripts/aws-local.sh sqs create-queue \
  --queue-name lambda-dev-dead-letter-queue

./scripts/aws-local.sh sqs create-queue \
  --queue-name lambda-dev-processing-queue \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:lambda-dev-dead-letter-queue\",\"maxReceiveCount\":\"3\"}"
  }'
```

### 4. Lambda Functions

Deploy a Lambda function:

```bash
./scripts/aws-local.sh lambda create-function \
  --function-name hello-function \
  --runtime nodejs18.x \
  --handler dist/handlers/hello.handler \
  --role arn:aws:iam::000000000000:role/lambda-role \
  --zip-file fileb://packages/lambdas/http-api/dist/handlers/hello.js.zip \
  --environment Variables="{POWERTOOLS_SERVICE_NAME=hello-service,POWERTOOLS_METRICS_NAMESPACE=HelloService}" \
  --timeout 10 \
  --memory-size 128
```

## Verifying AWS Resources

### 1. List DynamoDB Tables

```bash
./scripts/aws-local.sh dynamodb list-tables
```

### 2. List S3 Buckets

```bash
./scripts/aws-local.sh s3 ls
```

### 3. List SQS Queues

```bash
./scripts/aws-local.sh sqs list-queues
```

### 4. List Lambda Functions

```bash
./scripts/aws-local.sh lambda list-functions
```

## Testing Lambda Functions

### 1. Invoking a Lambda Function

```bash
./scripts/aws-local.sh lambda invoke \
  --function-name hello-function \
  --payload file://events/hello.json \
  --cli-binary-format raw-in-base64-out \
  output.json
```

Or use our script:

```bash
./scripts/test-lambda.sh hello-function events/hello.json
```

## Common Issues and Troubleshooting

### 1. LocalStack Not Starting

If LocalStack doesn't start, check Docker logs:

```bash
docker logs lambda-dev-localstack
```

### 2. AWS CLI Commands Failing

If AWS CLI commands fail, check:

- LocalStack is running (`curl http://localhost:4566/_localstack/health`)
- You're using the correct endpoint URL (`--endpoint-url=http://localhost:4566`)
- You have the correct AWS credentials set

### 3. Lambda Function Deployment Issues

If Lambda function deployment fails:

- Check that the function code is built (`pnpm run build`)
- Verify the handler path is correct
- Check that the role ARN is valid for LocalStack

## Best Practices

1. **Use the Helper Script**: Always use the `aws-local.sh` script for AWS CLI commands to ensure consistent configuration.

2. **Check LocalStack Health**: Before running commands, verify that LocalStack is running and healthy.

3. **Use Descriptive Resource Names**: Use consistent naming conventions for AWS resources to make them easier to identify.

4. **Automate Resource Creation**: Use scripts to automate the creation of AWS resources in LocalStack.

5. **Clean Up Resources**: When you're done, clean up resources to avoid conflicts in future sessions.

## Conclusion

With LocalStack and AWS CLI properly configured, you can develop and test AWS Lambda functions locally without deploying to the cloud. This saves time and resources during development and allows for faster iteration.

For more information, refer to:
- [LocalStack Documentation](https://docs.localstack.cloud/)
- [AWS CLI Documentation](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
