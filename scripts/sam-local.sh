#!/bin/bash
set -e

# Run AWS SAM locally

# Build the project
echo "Building the project..."
pnpm run build

# Start SAM local API
echo "Starting SAM local API..."
sam local start-api --warm-containers EAGER --host 0.0.0.0 --port 3000

# Note: This script will keep running until you press Ctrl+C
echo "SAM local API is running. Press Ctrl+C to stop."
