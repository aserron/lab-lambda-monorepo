import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { createApiResponse } from '@lambda-dev/core/utils';

// Initialize AWS Lambda Powertools
const logger = new Logger({ serviceName: 'websocket-service' });
const tracer = new Tracer({ serviceName: 'websocket-service' });
const metrics = new Metrics({ namespace: 'WebSocketService', serviceName: 'websocket-service' });

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Table name for storing connections
const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE || 'websocket-connections';

/**
 * Handler for WebSocket connect events
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Log the incoming event
  logger.info('Connect event received', { event });
  
  // Add custom metrics
  metrics.addMetric('WebSocketConnections', 1);
  
  try {
    // Extract connection ID
    const connectionId = event.requestContext.connectionId;
    
    if (!connectionId) {
      logger.error('Connection ID not found in event');
      return createApiResponse(500, { message: 'Connection ID not found' });
    }
    
    // Store connection in DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: CONNECTIONS_TABLE,
        Item: {
          connectionId,
          timestamp: Date.now(),
          ttl: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hour TTL
        },
      })
    );
    
    logger.info('Connection stored successfully', { connectionId });
    
    // Return success response
    return createApiResponse(200, { message: 'Connected' });
  } catch (error) {
    // Log error
    logger.error('Error in connect handler', error as Error);
    
    // Add error metric
    metrics.addMetric('WebSocketErrors', 1);
    
    // Return error response
    return createApiResponse(500, {
      message: 'Internal Server Error',
      code: 'INTERNAL_ERROR',
    });
  } finally {
    // Publish metrics
    metrics.publishStoredMetrics();
  }
};
