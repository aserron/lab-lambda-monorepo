# Lambda Dev

A TypeScript-based AWS Lambda development environment with local development support using Docker Compose.

## Project Structure

This project is organized as a monorepo using Turborepo:

```
lambda-dev/
├── packages/
│   ├── core/            # Shared utilities and types
│   ├── lambdas/         # AWS Lambda functions
│   │   ├── http-api/    # REST API handlers
│   │   ├── websocket/   # WebSocket handlers
│   │   └── events/      # Event-driven handlers
│   ├── infrastructure/  # AWS CDK code
│   └── frontend/        # (Optional) Frontend application
├── docker/              # Docker configurations
├── scripts/             # Development scripts
└── docs/                # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- AWS CLI
- AWS SAM CLI

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/lambda-dev.git
cd lambda-dev
```

2. Install dependencies:

```bash
npm install
```

3. Build the packages:

```bash
npm run build
```

### Local Development

1. Start the local development environment:

```bash
npm run start:local
```

This will start LocalStack and other services using Docker Compose.

2. Run the Lambda functions locally using AWS SAM:

```bash
npm run sam:build
npm run sam:local
```

3. Stop the local development environment:

```bash
npm run stop:local
```

## Available Scripts

- `npm run dev` - Run all packages in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run tests for all packages
- `npm run start:local` - Start the local development environment
- `npm run stop:local` - Stop the local development environment
- `npm run sam:build` - Build Lambda functions using AWS SAM
- `npm run sam:local` - Run Lambda functions locally using AWS SAM
- `npm run sam:invoke` - Invoke a specific Lambda function locally
- `npm run cdk:deploy` - Deploy the infrastructure using AWS CDK
- `npm run cdk:synth` - Synthesize CloudFormation templates using AWS CDK

## Documentation

For more detailed documentation, see the [docs](./docs) directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
