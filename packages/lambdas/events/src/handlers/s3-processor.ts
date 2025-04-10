import { S3Event, S3EventRecord } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Initialize AWS Lambda Powertools
const logger = new Logger({ serviceName: 's3-processor-service' });
const tracer = new Tracer({ serviceName: 's3-processor-service' });
const metrics = new Metrics({ namespace: 'S3ProcessorService', serviceName: 's3-processor-service' });

// Initialize S3 client
const s3Client = new S3Client({});

/**
 * Handler for S3 event processing
 */
export const handler = async (event: S3Event): Promise<void> => {
  // Log the incoming event
  logger.info('S3 event received', { event });
  
  // Add custom metrics
  metrics.addMetric('S3EventsProcessed', event.Records.length);
  
  try {
    // Process each record
    await Promise.all(
      event.Records.map(async (record) => {
        await processS3Record(record);
      })
    );
    
    logger.info('S3 events processed successfully');
  } catch (error) {
    // Log error
    logger.error('Error processing S3 events', error as Error);
    
    // Add error metric
    metrics.addMetric('S3ProcessingErrors', 1);
    
    // Re-throw to trigger Lambda retry
    throw error;
  } finally {
    // Publish metrics
    metrics.publishStoredMetrics();
  }
};

/**
 * Process a single S3 event record
 */
async function processS3Record(record: S3EventRecord): Promise<void> {
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\\+/g, ' '));
  
  logger.info('Processing S3 object', { bucket, key });
  
  try {
    // Get object from S3
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );
    
    // Process the object (example: read content)
    if (response.Body) {
      // For demonstration, we're just logging the content type
      logger.info('Object retrieved successfully', {
        bucket,
        key,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      });
      
      // Here you would add your actual processing logic
      // For example, parsing a CSV file, processing an image, etc.
    }
  } catch (error) {
    logger.error('Error processing S3 object', {
      bucket,
      key,
      error,
    });
    throw error;
  }
}
