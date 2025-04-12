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
