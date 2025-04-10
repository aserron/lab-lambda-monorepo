#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from './stacks/api-stack';
import { WebSocketStack } from './stacks/websocket-stack';
import { StorageStack } from './stacks/storage-stack';

const app = new cdk.App();

// Define environment
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Create stacks
const storageStack = new StorageStack(app, 'LambdaDevStorageStack', { env });

const apiStack = new ApiStack(app, 'LambdaDevApiStack', {
  env,
  dynamoTables: storageStack.tables,
});

const websocketStack = new WebSocketStack(app, 'LambdaDevWebSocketStack', {
  env,
  dynamoTables: storageStack.tables,
});

// Add tags to all resources
cdk.Tags.of(app).add('Project', 'LambdaDev');
cdk.Tags.of(app).add('Environment', process.env.ENVIRONMENT || 'dev');
