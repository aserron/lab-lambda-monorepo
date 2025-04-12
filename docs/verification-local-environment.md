# Local Development Environment Verification

This document outlines the steps to verify that the local development environment is working correctly.

## Prerequisites

- Docker and Docker Compose installed
- AWS CLI installed
- AWS SAM CLI installed
- Node.js and pnpm installed

## Verification Steps

### 1. Start the Local Environment

```bash
# From the project root
pnpm run start:local
```

Expected output:
- Docker Compose services should start successfully
- LocalStack should initialize and be ready
- AWS resources should be created in LocalStack

Verification:
- Check that all services are running:
  ```bash
  docker ps
  ```
- Verify LocalStack health:
  ```bash
  curl http://localhost:4566/_localstack/health
  ```
- Check that AWS resources were created:
  ```bash
  aws --endpoint-url=http://localhost:4566 dynamodb list-tables
  aws --endpoint-url=http://localhost:4566 s3 ls
  aws --endpoint-url=http://localhost:4566 sqs list-queues
  ```

### 2. Build the Project

```bash
# From the project root
pnpm run build
```

Expected output:
- All packages should build successfully
- No TypeScript errors should be reported

Verification:
- Check that the dist directories were created in each package

### 3. Deploy Lambda Functions to LocalStack

```bash
# From the project root
pnpm run deploy:local
```

Expected output:
- Lambda functions should be deployed to LocalStack

Verification:
- Check that Lambda functions were created:
  ```bash
  aws --endpoint-url=http://localhost:4566 lambda list-functions
  ```

### 4. Test HTTP API Lambda Function

```bash
# From the project root
pnpm run test:lambda hello-function events/hello.json
```

Expected output:
- Lambda function should be invoked successfully
- Response should include a greeting message

Verification:
- Check the output for a successful response with a greeting message

### 5. Test WebSocket Lambda Functions

```bash
# From the project root
pnpm run test:lambda connect-function events/websocket-connect.json
```

Expected output:
- Lambda function should be invoked successfully
- Connection should be stored in DynamoDB

Verification:
- Check the output for a successful response
- Verify the connection was stored in DynamoDB:
  ```bash
  aws --endpoint-url=http://localhost:4566 dynamodb scan --table-name websocket-connections
  ```

### 6. Test Event-Driven Lambda Functions

```bash
# From the project root
pnpm run test:lambda s3-processor-function events/s3-event.json
```

Expected output:
- Lambda function should be invoked successfully
- S3 event should be processed

Verification:
- Check the output for a successful response

### 7. Run AWS SAM Locally

```bash
# From the project root
pnpm run sam:build
pnpm run sam:local
```

Expected output:
- AWS SAM should build the project
- Local API Gateway should start
- Endpoints should be available at http://localhost:3000

Verification:
- Access the hello endpoint:
  ```bash
  curl http://localhost:3000/hello
  ```
- Check the response for a greeting message

### 8. Stop the Local Environment

```bash
# From the project root
pnpm run stop:local
```

Expected output:
- Docker Compose services should stop successfully

Verification:
- Check that all services are stopped:
  ```bash
  docker ps
  ```

## Troubleshooting

### Common Issues

1. **Docker Compose services fail to start**
   - Check Docker logs: `docker-compose -f docker/docker-compose.yml logs`
   - Ensure no port conflicts: `netstat -ano | findstr 4566`

2. **LocalStack not ready**
   - Check LocalStack logs: `docker logs lambda-dev-localstack`
   - Increase wait time in start-local.sh

3. **Lambda functions fail to deploy**
   - Check that the build was successful
   - Verify AWS credentials are set correctly
   - Check LocalStack logs for errors

4. **AWS SAM fails to start**
   - Ensure Docker is running
   - Check that the template.yaml file is valid
   - Verify AWS SAM CLI is installed correctly

## Conclusion

If all verification steps pass, the local development environment is working correctly and ready for development. If any step fails, refer to the troubleshooting section or check the logs for more information.
