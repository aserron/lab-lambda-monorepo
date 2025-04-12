# Development Scripts

This directory contains scripts for local development and testing.

## Available Scripts

### Local Environment Management

- `start-local.sh`: Starts the local development environment using Docker Compose
- `stop-local.sh`: Stops the local development environment
- `setup-local.sh`: Sets up AWS resources in LocalStack (called by start-local.sh)

### Development Workflow

- `dev-watch.sh`: Starts development with hot-reloading
- `deploy-local.sh`: Deploys Lambda functions to LocalStack
- `test-lambda.sh`: Tests a Lambda function locally

## Usage

### Starting the Local Environment

```bash
./scripts/start-local.sh
```

Or use the npm script:

```bash
pnpm run start:local
```

### Stopping the Local Environment

```bash
./scripts/stop-local.sh
```

Or use the npm script:

```bash
pnpm run stop:local
```

### Developing with Hot-Reloading

```bash
./scripts/dev-watch.sh
```

### Deploying Lambda Functions to LocalStack

```bash
./scripts/deploy-local.sh
```

### Testing a Lambda Function

```bash
./scripts/test-lambda.sh hello-function events/hello.json
```

## Adding New Scripts

When adding new scripts, make sure to:

1. Make them executable: `chmod +x scripts/your-script.sh`
2. Document them in this README
3. Add them to package.json if they should be available as npm scripts
