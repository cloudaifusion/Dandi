import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

// Example handler function (without rate limiting)
async function handleExampleEndpoint(
  request: NextRequest,
  rateLimitInfo: any
): Promise<NextResponse> {
  try {
    const { data } = await request.json();
    
    // Your endpoint logic here
    const result = {
      success: true,
      message: "Example endpoint processed successfully",
      data: data,
      processedAt: new Date().toISOString()
    };

    // Create response with rate limit info included
    return createRateLimitedResponse(result, rateLimitInfo);
    
  } catch (err) {
    console.error('Error in example endpoint:', err);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

// Export the rate-limited version of the handler
// You can customize the incrementBy value for different endpoints
export const POST = withRateLimit(handleExampleEndpoint, {
  endpoint: 'example-endpoint',
  incrementBy: 1 // You could set this to 2, 5, etc. for endpoints that cost more
});

// Example with different rate limit increment
export const GET = withRateLimit(async (request: NextRequest, rateLimitInfo: any) => {
  const result = {
    success: true,
    message: "GET request processed",
    timestamp: new Date().toISOString()
  };
  
  return createRateLimitedResponse(result, rateLimitInfo);
}, {
  endpoint: 'example-endpoint-get',
  incrementBy: 0.5 // This endpoint costs less, so increment by 0.5
}); 