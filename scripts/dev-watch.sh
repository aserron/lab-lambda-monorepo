#!/bin/bash
set -e

# Start development with hot-reloading

# Check if the local environment is running
if ! curl -s http://localhost:4566/_localstack/health > /dev/null; then
  echo "Local environment is not running. Starting it now..."
  ./scripts/start-local.sh
fi

# Build the project
echo "Building the project..."
pnpm run build

# Start TypeScript watch mode for all packages
echo "Starting TypeScript watch mode..."
pnpm run dev

# Note: This script will keep running until you press Ctrl+C
echo "Development environment is running. Press Ctrl+C to stop."
