# Local Development Environment

This directory contains Docker Compose configuration for the local development environment.

## Services

The local development environment includes the following services:

### LocalStack

[LocalStack](https://localstack.cloud/) provides a local AWS cloud stack for development and testing. It emulates the following AWS services:

- Lambda
- API Gateway
- DynamoDB
- S3
- SQS
- SNS
- CloudWatch
- IAM
- Logs

**URL:** http://localhost:4566

### DynamoDB Admin

A web-based admin interface for DynamoDB local.

**URL:** http://localhost:8001

### S3 Explorer

A web-based explorer for S3 buckets.

**URL:** http://localhost:8002

### SQS Admin

A web-based admin interface for SQS queues.

**URL:** http://localhost:8003

### Lambda Console

A web-based console for managing Lambda functions.

**URL:** http://localhost:8004

## Usage

### Starting the Environment

```bash
# From the project root
cd docker
docker-compose up -d
```

Or use the npm script:

```bash
pnpm run start:local
```

### Stopping the Environment

```bash
# From the project root
cd docker
docker-compose down
```

Or use the npm script:

```bash
pnpm run stop:local
```

### Viewing Logs

```bash
# From the project root
cd docker
docker-compose logs -f
```

### Accessing Services

- LocalStack: http://localhost:4566
- DynamoDB Admin: http://localhost:8001
- S3 Explorer: http://localhost:8002
- SQS Admin: http://localhost:8003
- Lambda Console: http://localhost:8004

## Environment Variables

Environment variables for the Docker Compose setup are stored in the `.env` file. You can modify these variables to customize the local development environment.

## AWS CLI Configuration

To use AWS CLI with LocalStack, you can set the following environment variables:

```bash
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export AWS_ENDPOINT_URL=http://localhost:4566
```

Or use the `--endpoint-url` parameter:

```bash
aws --endpoint-url=http://localhost:4566 s3 ls
```
