# Event Files

This directory contains example event files for testing Lambda functions locally.

## Available Events

- `hello.json`: Example event for the HTTP API Lambda function
- `websocket-connect.json`: Example event for the WebSocket connect Lambda function
- `websocket-message.json`: Example event for the WebSocket message Lambda function
- `s3-event.json`: Example event for the S3 processor Lambda function
- `sqs-event.json`: Example event for the SQS consumer Lambda function

## Usage

### Using AWS SAM

```bash
sam local invoke HelloFunction --event events/hello.json
```

Or use the script:

```bash
./scripts/sam-invoke.sh HelloFunction events/hello.json
```

### Using AWS CLI with LocalStack

```bash
aws --endpoint-url=http://localhost:4566 lambda invoke \
  --function-name hello-function \
  --payload file://events/hello.json \
  --cli-binary-format raw-in-base64-out \
  output.json
```

Or use the script:

```bash
./scripts/test-lambda.sh hello-function events/hello.json
```

## Creating Custom Events

You can create custom event files by copying and modifying the existing examples. Make sure to follow the correct event structure for each Lambda function type:

- HTTP API: Include httpMethod, path, queryStringParameters, headers, body
- WebSocket: Include requestContext with connectionId, domainName, stage
- S3: Include Records array with s3 event details
- SQS: Include Records array with SQS message details
