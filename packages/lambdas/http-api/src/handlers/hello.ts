import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { createApiResponse } from '@lambda-dev/core/utils';

// Initialize AWS Lambda Powertools
const logger = new Logger({ serviceName: 'hello-service' });
const tracer = new Tracer({ serviceName: 'hello-service' });
const metrics = new Metrics({ namespace: 'HelloService', serviceName: 'hello-service' });

/**
 * Simple hello world Lambda function
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Log the incoming event
  logger.info('Event received', { event });
  
  // Add custom metrics
  metrics.addMetric('ApiCalls', 1);
  
  try {
    // Extract name from query parameters or use default
    const name = event.queryStringParameters?.name || 'World';
    
    // Create response
    const response = {
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
    };
    
    // Return formatted response
    return createApiResponse(200, response);
  } catch (error) {
    // Log error
    logger.error('Error in hello handler', error as Error);
    
    // Add error metric
    metrics.addMetric('ApiErrors', 1);
    
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
