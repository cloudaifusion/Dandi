/**
 * Rate Limiting Helper Utilities
 * 
 * This file provides quick templates and examples for adding rate limiting
 * to new API endpoints in your application.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, createRateLimitedResponse, checkRateLimit } from './rate-limiting';

/**
 * Quick template for creating a new rate-limited endpoint
 */
export function createRateLimitedEndpoint(
  handler: (request: NextRequest, rateLimitInfo: any) => Promise<NextResponse>,
  config: {
    endpoint: string;
    incrementBy?: number;
  }
) {
  return withRateLimit(handler, config);
}

/**
 * Common endpoint configurations
 */
export const ENDPOINT_CONFIGS = {
  // Lightweight endpoints (status checks, simple queries)
  LIGHTWEIGHT: {
    incrementBy: 0.5,
    description: 'For simple status checks and basic queries'
  },
  
  // Standard endpoints (data processing, CRUD operations)
  STANDARD: {
    incrementBy: 1,
    description: 'For standard data processing and CRUD operations'
  },
  
  // Heavy endpoints (AI processing, complex calculations)
  HEAVY: {
    incrementBy: 5,
    description: 'For AI processing, complex calculations, or resource-intensive operations'
  },
  
  // Premium endpoints (very resource intensive)
  PREMIUM: {
    incrementBy: 10,
    description: 'For very resource-intensive operations like large AI models'
  }
} as const;

/**
 * Template for a simple GET endpoint
 */
export function createSimpleGetEndpoint(endpointName: string, incrementBy: number = 1) {
  return withRateLimit(async (request: NextRequest, rateLimitInfo: any) => {
    const result = {
      success: true,
      message: `${endpointName} processed successfully`,
      timestamp: new Date().toISOString()
    };
    
    return createRateLimitedResponse(result, rateLimitInfo);
  }, {
    endpoint: endpointName,
    incrementBy
  });
}

/**
 * Template for a data processing POST endpoint
 */
export function createDataProcessingEndpoint(endpointName: string, incrementBy: number = 1) {
  return withRateLimit(async (request: NextRequest, rateLimitInfo: any) => {
    const { data } = await request.json();
    
    // Your data processing logic here
    const processedData = {
      ...data,
      processedAt: new Date().toISOString(),
      processedBy: endpointName
    };
    
    const result = {
      success: true,
      message: `${endpointName} processed successfully`,
      data: processedData
    };
    
    return createRateLimitedResponse(result, rateLimitInfo);
  }, {
    endpoint: endpointName,
    incrementBy
  });
}

/**
 * Example usage patterns
 */
export const USAGE_EXAMPLES = {
  // Example 1: Simple status endpoint
  statusEndpoint: `
// app/api/status/route.ts
import { createSimpleGetEndpoint } from '../../../lib/rate-limit-helper';

export const GET = createSimpleGetEndpoint('status-check', 0.5);
  `,

  // Example 2: Data processing endpoint
  dataProcessingEndpoint: `
// app/api/data-processor/route.ts
import { createDataProcessingEndpoint } from '../../../lib/rate-limit-helper';

export const POST = createDataProcessingEndpoint('data-processor', 1);
  `,

  // Example 3: AI processing endpoint
  aiEndpoint: `
// app/api/ai-analysis/route.ts
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

async function handleAIAnalysis(request: NextRequest, rateLimitInfo: any) {
  const { text } = await request.json();
  
  // Your AI processing logic here
  const analysis = await processWithAI(text);
  
  return createRateLimitedResponse({
    success: true,
    analysis: analysis
  }, rateLimitInfo);
}

export const POST = withRateLimit(handleAIAnalysis, {
  endpoint: 'ai-analysis',
  incrementBy: 5 // Heavy processing
});
  `,

  // Example 4: Custom endpoint with manual rate limiting
  customEndpoint: `
// app/api/custom/route.ts
import { checkRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key required' }, { status: 400 });
  }

  const rateLimitResult = await checkRateLimit(apiKey, {
    endpoint: 'custom-endpoint',
    incrementBy: 2
  });

  if (!rateLimitResult.success) {
    const status = rateLimitResult.error === 'Rate limit exceeded' ? 429 : 401;
    return NextResponse.json({
      success: false,
      error: rateLimitResult.error,
      usage: rateLimitResult.usage,
      limit: rateLimitResult.limit
    }, { status });
  }

  // Your custom logic here
  const result = { success: true, data: "custom processed" };
  
  return createRateLimitedResponse(result, rateLimitResult);
}
  `
} as const;

/**
 * Quick reference for common patterns
 */
export const QUICK_REFERENCE = {
  // How to add rate limiting to existing endpoint
  addToExisting: `
// Before
export async function POST(request: NextRequest) {
  // Your existing logic
}

// After
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

async function handleEndpoint(request: NextRequest, rateLimitInfo: any) {
  // Your existing logic
  const result = { success: true, data: "processed" };
  return createRateLimitedResponse(result, rateLimitInfo);
}

export const POST = withRateLimit(handleEndpoint, {
  endpoint: 'your-endpoint-name',
  incrementBy: 1
});
  `,

  // How to handle different HTTP methods
  multipleMethods: `
// app/api/example/route.ts
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

async function handleGet(request: NextRequest, rateLimitInfo: any) {
  return createRateLimitedResponse({ success: true, method: 'GET' }, rateLimitInfo);
}

async function handlePost(request: NextRequest, rateLimitInfo: any) {
  const { data } = await request.json();
  return createRateLimitedResponse({ success: true, data }, rateLimitInfo);
}

export const GET = withRateLimit(handleGet, { endpoint: 'example-get', incrementBy: 0.5 });
export const POST = withRateLimit(handlePost, { endpoint: 'example-post', incrementBy: 1 });
  `
} as const; 