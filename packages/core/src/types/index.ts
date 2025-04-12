// Common types used across the application

/**
 * Standard API response format
 */
export interface ApiResponse {
  statusCode: number;
  body: string; // JSON stringified response
  headers: Record<string, string>;
  isBase64Encoded: boolean;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  message: string;
  code: string;
  details?: any;
}

/**
 * WebSocket connection information
 */
export interface WebSocketConnection {
  connectionId: string;
  timestamp: number;
  userId?: string;
}
