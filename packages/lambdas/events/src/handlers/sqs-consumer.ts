import { SQSEvent, SQSRecord } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';

// Initialize AWS Lambda Powertools
const logger = new Logger({ serviceName: 'sqs-consumer-service' });
const tracer = new Tracer({ serviceName: 'sqs-consumer-service' });
const metrics = new Metrics({ namespace: 'SQSConsumerService', serviceName: 'sqs-consumer-service' });

/**
 * Handler for SQS event processing
 */
export const handler = async (event: SQSEvent): Promise<void> => {
  // Log the incoming event
  logger.info('SQS event received', { event });
  
  // Add custom metrics
  metrics.addMetric('SQSMessagesProcessed', event.Records.length);
  
  try {
    // Process each record
    const results = await Promise.allSettled(
      event.Records.map(async (record) => {
        return processSQSRecord(record);
      })
    );
    
    // Check for failures
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      logger.warn(`${failures.length} SQS messages failed processing`, { 
        totalMessages: event.Records.length,
        failedCount: failures.length 
      });
      
      // Add failure metrics
      metrics.addMetric('SQSProcessingFailures', failures.length);
    }
    
    logger.info('SQS event processing completed', {
      totalMessages: event.Records.length,
      successCount: event.Records.length - failures.length,
      failureCount: failures.length
    });
  } catch (error) {
    // Log error
    logger.error('Error processing SQS event', error as Error);
    
    // Add error metric
    metrics.addMetric('SQSProcessingErrors', 1);
    
    // Re-throw to trigger Lambda retry
    throw error;
  } finally {
    // Publish metrics
    metrics.publishStoredMetrics();
  }
};

/**
 * Process a single SQS message
 */
async function processSQSRecord(record: SQSRecord): Promise<void> {
  const messageId = record.messageId;
  
  logger.info('Processing SQS message', { messageId });
  
  try {
    // Parse message body
    const body = JSON.parse(record.body);
    
    // Process the message based on its content
    // This is where you would add your business logic
    logger.info('Message body parsed successfully', {
      messageId,
      messageType: body.type || 'unknown'
    });
    
    // Example: Process different message types
    switch (body.type) {
      case 'USER_CREATED':
        // Handle user creation
        logger.info('Processing user creation', { userId: body.userId });
        // await processUserCreation(body);
        break;
        
      case 'ORDER_PLACED':
        // Handle order placement
        logger.info('Processing order placement', { orderId: body.orderId });
        // await processOrderPlacement(body);
        break;
        
      default:
        logger.warn('Unknown message type', { type: body.type });
        // Handle unknown message type
        break;
    }
    
    // Add processing success metric
    metrics.addMetric('SQSMessageProcessingSuccess', 1);
  } catch (error) {
    logger.error('Error processing SQS message', {
      messageId,
      error,
    });
    
    // Add processing failure metric
    metrics.addMetric('SQSMessageProcessingFailure', 1);
    
    // Re-throw to mark this specific message as failed
    throw error;
  }
}
