import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface StorageStackProps extends cdk.StackProps {}

export class StorageStack extends cdk.Stack {
  public readonly tables: {
    connectionsTable: dynamodb.Table;
  };
  
  public readonly buckets: {
    dataBucket: s3.Bucket;
  };
  
  public readonly queues: {
    processingQueue: sqs.Queue;
    deadLetterQueue: sqs.Queue;
  };

  constructor(scope: Construct, id: string, props?: StorageStackProps) {
    super(scope, id, props);

    // Create DynamoDB tables
    const connectionsTable = new dynamodb.Table(this, 'WebSocketConnections', {
      partitionKey: { name: 'connectionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development; use RETAIN for production
    });

    // Create S3 buckets
    const dataBucket = new s3.Bucket(this, 'DataBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development; use RETAIN for production
      autoDeleteObjects: true, // For development; remove for production
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30),
          prefix: 'temp/',
        },
      ],
    });

    // Create SQS queues
    const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriod: cdk.Duration.days(14),
    });

    const processingQueue = new sqs.Queue(this, 'ProcessingQueue', {
      visibilityTimeout: cdk.Duration.seconds(30),
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3,
      },
    });

    // Export resources
    this.tables = {
      connectionsTable,
    };

    this.buckets = {
      dataBucket,
    };

    this.queues = {
      processingQueue,
      deadLetterQueue,
    };

    // Outputs
    new cdk.CfnOutput(this, 'ConnectionsTableName', {
      value: connectionsTable.tableName,
      description: 'DynamoDB table for WebSocket connections',
    });

    new cdk.CfnOutput(this, 'DataBucketName', {
      value: dataBucket.bucketName,
      description: 'S3 bucket for data storage',
    });

    new cdk.CfnOutput(this, 'ProcessingQueueUrl', {
      value: processingQueue.queueUrl,
      description: 'SQS queue for processing messages',
    });
  }
}
