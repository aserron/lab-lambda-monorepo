import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from '@aws-sdk/client-apigatewaymanagementapi';
import { createApiResponse, parseEventBody } from '@lambda-dev/core/utils';

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
 * Handler for WebSocket message events
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Log the incoming event
  logger.info('Message event received', { event });
  
  // Add custom metrics
  metrics.addMetric('WebSocketMessages', 1);
  
  try {
    // Extract connection ID and domain name
    const connectionId = event.requestContext.connectionId;
    const domain = event.requestContext.domainName;
    const stage = event.requestContext.stage;
    
    if (!connectionId || !domain) {
      logger.error('Connection ID or domain not found in event');
      return createApiResponse(500, { message: 'Connection information not found' });
    }
    
    // Parse message body
    const body = parseEventBody<{ action: string; message: string }>(event.body);
    
    if (!body || !body.message) {
      logger.error('Invalid message format');
      return createApiResponse(400, { message: 'Invalid message format' });
    }
    
    // Initialize API Gateway Management API client
    const apiGateway = new ApiGatewayManagementApiClient({
      endpoint: `https://${domain}/${stage}`,
    });
    
    // Get all connections
    const { Items = [] } = await docClient.send(
      new ScanCommand({
        TableName: CONNECTIONS_TABLE,
      })
    );
    
    // Broadcast message to all connections
    const sendPromises = Items.map(async (connection) => {
      try {
        // Skip sending to the sender
        if (connection.connectionId === connectionId) return;
        
        // Send message
        await apiGateway.send(
          new PostToConnectionCommand({
            ConnectionId: connection.connectionId,
            Data: Buffer.from(
              JSON.stringify({
                message: body.message,
                sender: connectionId,
                timestamp: new Date().toISOString(),
              })
            ),
          })
        );
      } catch (error) {
        logger.error('Error sending message to connection', {
          connectionId: connection.connectionId,
          error,
        });
      }
    });
    
    // Wait for all messages to be sent
    await Promise.all(sendPromises);
    
    logger.info('Message broadcast successfully');
    
    // Return success response
    return createApiResponse(200, { message: 'Message sent' });
  } catch (error) {
    // Log error
    logger.error('Error in message handler', error as Error);
    
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
