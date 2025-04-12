#!/bin/bash
set -e

# Invoke a Lambda function using AWS SAM

# Check if a function name was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <function-name> [event-file]"
  echo "Example: $0 HelloFunction events/hello.json"
  exit 1
fi

FUNCTION_NAME=$1
EVENT_FILE=${2:-events/default.json}

# Check if the event file exists
if [ ! -f "$EVENT_FILE" ]; then
  echo "Event file $EVENT_FILE does not exist."
  echo "Creating a default event file..."
  mkdir -p events
  echo '{"key1": "value1", "key2": "value2", "key3": "value3"}' > events/default.json
  EVENT_FILE=events/default.json
fi

# Build the project
echo "Building the project..."
pnpm run build

# Invoke the Lambda function
echo "Invoking Lambda function $FUNCTION_NAME with event from $EVENT_FILE..."
sam local invoke $FUNCTION_NAME --event $EVENT_FILE

echo "Lambda function invocation completed!"
