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
