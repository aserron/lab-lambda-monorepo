#!/bin/bash
set -e

# Initialize all packages in the monorepo

echo "Initializing packages..."

# Initialize core package
echo "Initializing core package..."
cd packages/core
pnpm init
cd ../..

# Initialize lambda packages
echo "Initializing lambda packages..."

# HTTP API
echo "Initializing HTTP API package..."
cd packages/lambdas/http-api
pnpm init
cd ../../..

# WebSocket
echo "Initializing WebSocket package..."
cd packages/lambdas/websocket
pnpm init
cd ../../..

# Events
echo "Initializing Events package..."
cd packages/lambdas/events
pnpm init
cd ../../..

# Infrastructure
echo "Initializing Infrastructure package..."
cd packages/infrastructure
pnpm init
cd ../..

# Frontend (if it exists)
if [ -d "packages/frontend" ]; then
  echo "Initializing Frontend package..."
  cd packages/frontend
  pnpm init
  cd ../..
fi

echo "All packages initialized!"
