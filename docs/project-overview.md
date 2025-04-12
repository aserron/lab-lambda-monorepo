# Lambda Dev: Project Overview

## Introduction

Lambda Dev is a TypeScript-based AWS Lambda development environment designed to facilitate local development of serverless applications. This document outlines the project's architecture, components, and intended use cases.

## Project Architecture

The project follows a monorepo structure using Turborepo and pnpm, with separate packages for different concerns:

```mermaid
graph TD
    Root[Lambda Dev Monorepo]
    Core[Core Package]
    Lambdas[Lambda Functions]
    Infra[Infrastructure]
    Docker[Docker Setup]
    
    Root --> Core
    Root --> Lambdas
    Root --> Infra
    Root --> Docker
    
    Lambdas --> HttpAPI[HTTP API Lambdas]
    Lambdas --> WebSocket[WebSocket Lambdas]
    Lambdas --> Events[Event-Driven Lambdas]
    
    Core -.-> HttpAPI
    Core -.-> WebSocket
    Core -.-> Events
    
    Infra -.-> HttpAPI
    Infra -.-> WebSocket
    Infra -.-> Events
```

## Components

### 1. Core Package

The core package contains shared utilities, types, and helper functions used across the project:

- API response formatters
- Error handling utilities
- Common types and interfaces
- Shared business logic

### 2. Lambda Functions

#### HTTP API Lambdas

Lambda functions for handling HTTP requests through API Gateway:

```mermaid
sequenceDiagram
    Client->>API Gateway: HTTP Request
    API Gateway->>Lambda: Invoke Function
    Lambda->>DynamoDB: Query/Update Data
    DynamoDB->>Lambda: Return Data
    Lambda->>API Gateway: Return Response
    API Gateway->>Client: HTTP Response
```

#### WebSocket Lambdas

Lambda functions for handling WebSocket connections and messages:

```mermaid
sequenceDiagram
    Client->>API Gateway: WebSocket Connect
    API Gateway->>Connect Lambda: Invoke Function
    Connect Lambda->>DynamoDB: Store Connection
    
    Client->>API Gateway: WebSocket Message
    API Gateway->>Message Lambda: Invoke Function
    Message Lambda->>DynamoDB: Get Connections
    Message Lambda->>API Gateway: Send to Connections
    API Gateway->>Client: Broadcast Message
    
    Client->>API Gateway: WebSocket Disconnect
    API Gateway->>Disconnect Lambda: Invoke Function
    Disconnect Lambda->>DynamoDB: Remove Connection
```

#### Event-Driven Lambdas

Lambda functions triggered by AWS service events:

```mermaid
sequenceDiagram
    S3->>S3 Processor Lambda: File Upload Event
    S3 Processor Lambda->>S3: Process File
    
    SQS->>SQS Consumer Lambda: Message Event
    SQS Consumer Lambda->>DynamoDB: Update Data
```

### 3. Infrastructure as Code

AWS CDK code for defining and deploying infrastructure:

```mermaid
graph TD
    CDK[AWS CDK]
    CDK --> ApiStack[API Stack]
    CDK --> WebSocketStack[WebSocket Stack]
    CDK --> StorageStack[Storage Stack]
    
    ApiStack --> ApiGateway[API Gateway]
    ApiStack --> HttpLambdas[HTTP Lambda Functions]
    
    WebSocketStack --> WebSocketApi[WebSocket API]
    WebSocketStack --> WebSocketLambdas[WebSocket Lambda Functions]
    
    StorageStack --> DynamoDB[DynamoDB Tables]
    StorageStack --> S3[S3 Buckets]
    StorageStack --> SQS[SQS Queues]
```

### 4. Local Development Environment

Docker Compose setup with LocalStack for local development:

```mermaid
graph TD
    Docker[Docker Compose]
    Docker --> LocalStack[LocalStack]
    Docker --> DynamoAdmin[DynamoDB Admin]
    Docker --> S3Explorer[S3 Explorer]
    
    LocalStack --> LocalLambda[Lambda Emulation]
    LocalStack --> LocalApiGateway[API Gateway Emulation]
    LocalStack --> LocalDynamoDB[DynamoDB Emulation]
    LocalStack --> LocalS3[S3 Emulation]
    LocalStack --> LocalSQS[SQS Emulation]
```

## Use Cases

### 1. API Development

Building REST APIs using AWS Lambda and API Gateway:

- Creating HTTP endpoints for CRUD operations
- Implementing authentication and authorization
- Handling request validation and error responses

### 2. Real-time Communication

Implementing WebSocket functionality:

- Managing WebSocket connections
- Broadcasting messages to connected clients
- Implementing real-time features like chat, notifications, etc.

### 3. Event Processing

Handling events from various AWS services:

- Processing S3 events (file uploads, deletions, etc.)
- Consuming messages from SQS queues
- Responding to other AWS service events

### 4. Local Development and Testing

Enabling developers to work locally:

- Running Lambda functions locally with hot-reloading
- Testing against emulated AWS services
- Debugging and troubleshooting without deploying to AWS

## Development Workflow

```mermaid
graph LR
    Dev[Developer] --> Local[Local Development]
    Local --> Test[Testing]
    Test --> Build[Build]
    Build --> Deploy[Deployment]
    
    Local --> DockerCompose[Docker Compose]
    Local --> SAM[AWS SAM]
    
    Test --> Jest[Jest Tests]
    
    Build --> TypeScript[TypeScript Compilation]
    Build --> Bundling[Lambda Bundling]
    
    Deploy --> CDK[AWS CDK Deployment]
```

## Example Scenario: User Management API

As an example use case, we could implement a user management API with the following features:

1. **HTTP API Endpoints**:
   - `GET /users`: List all users
   - `GET /users/{id}`: Get a specific user
   - `POST /users`: Create a new user
   - `PUT /users/{id}`: Update a user
   - `DELETE /users/{id}`: Delete a user

2. **WebSocket Notifications**:
   - Real-time notifications when users are created, updated, or deleted
   - Online status updates

3. **Event Processing**:
   - Process user profile image uploads to S3
   - Handle background tasks via SQS messages

This example demonstrates how the different components of the project work together to create a complete serverless application.

## Conclusion

Lambda Dev provides a comprehensive development environment for building serverless applications with AWS Lambda. By following the monorepo structure and using tools like Turborepo, pnpm, and TypeScript, we can create a scalable and maintainable codebase that supports various use cases and deployment scenarios.
