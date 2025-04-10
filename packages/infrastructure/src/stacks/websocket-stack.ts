import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export interface WebSocketStackProps extends cdk.StackProps {
  dynamoTables: {
    connectionsTable: dynamodb.Table;
  };
}

export class WebSocketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebSocketStackProps) {
    super(scope, id, props);

    // Create Lambda functions for WebSocket API
    const connectFunction = new lambda.Function(this, 'ConnectFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/handlers/connect.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambdas/websocket')),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        POWERTOOLS_SERVICE_NAME: 'websocket-service',
        POWERTOOLS_METRICS_NAMESPACE: 'WebSocketService',
        CONNECTIONS_TABLE: props.dynamoTables.connectionsTable.tableName,
      },
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(10),
    });

    const disconnectFunction = new lambda.Function(this, 'DisconnectFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/handlers/disconnect.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambdas/websocket')),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        POWERTOOLS_SERVICE_NAME: 'websocket-service',
        POWERTOOLS_METRICS_NAMESPACE: 'WebSocketService',
        CONNECTIONS_TABLE: props.dynamoTables.connectionsTable.tableName,
      },
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(10),
    });

    const messageFunction = new lambda.Function(this, 'MessageFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/handlers/message.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambdas/websocket')),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        POWERTOOLS_SERVICE_NAME: 'websocket-service',
        POWERTOOLS_METRICS_NAMESPACE: 'WebSocketService',
        CONNECTIONS_TABLE: props.dynamoTables.connectionsTable.tableName,
      },
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(10),
    });

    // Create WebSocket API
    const webSocketApi = new apigatewayv2.CfnApi(this, 'WebSocketApi', {
      name: 'LambdaDevWebSocketApi',
      protocolType: 'WEBSOCKET',
      routeSelectionExpression: '$request.body.action',
    });

    // Create WebSocket routes
    const connectRoute = new apigatewayv2.CfnRoute(this, 'ConnectRoute', {
      apiId: webSocketApi.ref,
      routeKey: '$connect',
      authorizationType: 'NONE',
      target: `integrations/${connectIntegration.ref}`,
    });

    const disconnectRoute = new apigatewayv2.CfnRoute(this, 'DisconnectRoute', {
      apiId: webSocketApi.ref,
      routeKey: '$disconnect',
      authorizationType: 'NONE',
      target: `integrations/${disconnectIntegration.ref}`,
    });

    const messageRoute = new apigatewayv2.CfnRoute(this, 'MessageRoute', {
      apiId: webSocketApi.ref,
      routeKey: 'message',
      authorizationType: 'NONE',
      target: `integrations/${messageIntegration.ref}`,
    });

    // Create WebSocket integrations
    const connectIntegration = new apigatewayv2.CfnIntegration(this, 'ConnectIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${connectFunction.functionArn}/invocations`,
    });

    const disconnectIntegration = new apigatewayv2.CfnIntegration(this, 'DisconnectIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${disconnectFunction.functionArn}/invocations`,
    });

    const messageIntegration = new apigatewayv2.CfnIntegration(this, 'MessageIntegration', {
      apiId: webSocketApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${messageFunction.functionArn}/invocations`,
    });

    // Create WebSocket deployment and stage
    const deployment = new apigatewayv2.CfnDeployment(this, 'WebSocketDeployment', {
      apiId: webSocketApi.ref,
    });

    const stage = new apigatewayv2.CfnStage(this, 'WebSocketStage', {
      apiId: webSocketApi.ref,
      stageName: 'dev',
      deploymentId: deployment.ref,
    });

    // Add dependencies to ensure proper deployment
    deployment.addDependency(connectRoute);
    deployment.addDependency(disconnectRoute);
    deployment.addDependency(messageRoute);

    // Grant permissions
    props.dynamoTables.connectionsTable.grantReadWriteData(connectFunction);
    props.dynamoTables.connectionsTable.grantReadWriteData(disconnectFunction);
    props.dynamoTables.connectionsTable.grantReadWriteData(messageFunction);

    // Grant permissions for WebSocket API to invoke Lambda functions
    connectFunction.addPermission('WebSocketConnectPermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${webSocketApi.ref}/*/$connect`,
    });

    disconnectFunction.addPermission('WebSocketDisconnectPermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${webSocketApi.ref}/*/$disconnect`,
    });

    messageFunction.addPermission('WebSocketMessagePermission', {
      principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${this.region}:${this.account}:${webSocketApi.ref}/*/message`,
    });

    // Grant permissions for WebSocket API to manage connections
    const apiGatewayManagementPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['execute-api:ManageConnections'],
      resources: [`arn:aws:execute-api:${this.region}:${this.account}:${webSocketApi.ref}/*`],
    });

    messageFunction.addToRolePolicy(apiGatewayManagementPolicy);

    // Outputs
    new cdk.CfnOutput(this, 'WebSocketApiEndpoint', {
      value: `wss://${webSocketApi.ref}.execute-api.${this.region}.amazonaws.com/${stage.stageName}`,
      description: 'WebSocket API endpoint URL',
    });
  }
}
