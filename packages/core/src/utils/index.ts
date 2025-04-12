// Common utility functions

/**
 * Creates a standardized API response
 */
export function createApiResponse(
  statusCode: number,
  body: any,
  headers: Record<string, string> = {}
) {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    isBase64Encoded: false,
  };
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  statusCode: number,
  message: string,
  code: string,
  details?: any
) {
  return createApiResponse(
    statusCode,
    {
      message,
      code,
      details,
    },
    {
      'Content-Type': 'application/json',
    }
  );
}

/**
 * Parses and validates event body
 */
export function parseEventBody<T>(body: string | null): T | null {
  if (!body) return null;

  try {
    return JSON.parse(body) as T;
  } catch (error) {
    return null;
  }
}
