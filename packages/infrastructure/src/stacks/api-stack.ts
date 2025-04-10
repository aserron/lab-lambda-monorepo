import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';

export interface ApiStackProps extends cdk.StackProps {
  dynamoTables: {
    connectionsTable: dynamodb.Table;
  };
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Create Lambda function for HTTP API
    const helloFunction = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/handlers/hello.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambdas/http-api')),
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        POWERTOOLS_SERVICE_NAME: 'hello-service',
        POWERTOOLS_METRICS_NAMESPACE: 'HelloService',
      },
      tracing: lambda.Tracing.ACTIVE,
      timeout: cdk.Duration.seconds(10),
    });

    // Create REST API
    const api = new apigateway.RestApi(this, 'LambdaDevApi', {
      restApiName: 'Lambda Dev API',
      description: 'API for Lambda Dev project',
      deployOptions: {
        stageName: 'dev',
        tracingEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create API resources and methods
    const helloResource = api.root.addResource('hello');
    helloResource.addMethod('GET', new apigateway.LambdaIntegration(helloFunction));

    // Grant permissions
    props.dynamoTables.connectionsTable.grantReadWriteData(helloFunction);

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
}
