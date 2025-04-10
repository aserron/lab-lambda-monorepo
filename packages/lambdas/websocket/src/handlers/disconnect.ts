import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
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
 * Handler for WebSocket disconnect events
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Log the incoming event
  logger.info('Disconnect event received', { event });
  
  // Add custom metrics
  metrics.addMetric('WebSocketDisconnections', 1);
  
  try {
    // Extract connection ID
    const connectionId = event.requestContext.connectionId;
    
    if (!connectionId) {
      logger.error('Connection ID not found in event');
      return createApiResponse(500, { message: 'Connection ID not found' });
    }
    
    // Remove connection from DynamoDB
    await docClient.send(
      new DeleteCommand({
        TableName: CONNECTIONS_TABLE,
        Key: {
          connectionId,
        },
      })
    );
    
    logger.info('Connection removed successfully', { connectionId });
    
    // Return success response
    return createApiResponse(200, { message: 'Disconnected' });
  } catch (error) {
    // Log error
    logger.error('Error in disconnect handler', error as Error);
    
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
