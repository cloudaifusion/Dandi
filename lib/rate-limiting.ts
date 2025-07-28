import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '../app/api/supabase-server';

export interface RateLimitConfig {
  endpoint: string;
  incrementBy?: number; // Default is 1
}

export interface RateLimitResult {
  success: boolean;
  usage?: number;
  limit?: number;
  error?: string;
}

/**
 * Reusable rate limiting middleware for API endpoints
 * @param apiKey - The API key from the request header
 * @param config - Configuration for the rate limiting
 * @returns RateLimitResult with success status and usage info
 */
export async function checkRateLimit(
  apiKey: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    // Get the API key details including usage and limit
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single();

    if (apiKeyError || !apiKeyData) {
      return {
        success: false,
        error: 'Invalid or inactive API key'
      };
    }

    // Check rate limit before processing the request
    const currentUsage = apiKeyData.usage || 0;
    const rateLimit = apiKeyData.limit || 1000;
    const incrementBy = config.incrementBy || 1;

    if (currentUsage + incrementBy > rateLimit) {
      return {
        success: false,
        usage: currentUsage,
        limit: rateLimit,
        error: 'Rate limit exceeded'
      };
    }

    // Increment usage atomically
    const { error: updateError } = await supabaseClient
      .from('api_keys')
      .update({ usage: currentUsage + incrementBy })
      .eq('key', apiKey)
      .eq('status', 'active');

    if (updateError) {
      console.error(`Error updating API key usage for ${config.endpoint}:`, updateError);
      return {
        success: false,
        error: 'Failed to update usage tracking'
      };
    }

    return {
      success: true,
      usage: currentUsage + incrementBy,
      limit: rateLimit
    };

  } catch (error) {
    console.error(`Rate limiting error for ${config.endpoint}:`, error);
    return {
      success: false,
      error: 'Rate limiting check failed'
    };
  }
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 * @param handler - The original API handler function
 * @param config - Rate limiting configuration
 * @returns Wrapped handler with rate limiting
 */
export function withRateLimit<T = any>(
  handler: (request: NextRequest, rateLimitInfo: RateLimitResult) => Promise<NextResponse<T>>,
  config: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse<T | { success: false; error: string; usage?: number; limit?: number }>> => {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(apiKey, config);

    if (!rateLimitResult.success) {
      const status = rateLimitResult.error === 'Rate limit exceeded' ? 429 : 401;
      return NextResponse.json(
        {
          success: false,
          error: rateLimitResult.error || 'Unknown error',
          usage: rateLimitResult.usage,
          limit: rateLimitResult.limit
        },
        { status }
      );
    }

    // Call the original handler with rate limit info
    return handler(request, rateLimitResult);
  };
}

/**
 * Utility function to create a rate-limited API response
 * @param data - The response data
 * @param rateLimitInfo - Rate limiting information
 * @returns NextResponse with rate limit info included
 */
export function createRateLimitedResponse<T>(
  data: T,
  rateLimitInfo: RateLimitResult
): NextResponse<T & { usage: number; limit: number }> {
  return NextResponse.json({
    ...data,
    usage: rateLimitInfo.usage!,
    limit: rateLimitInfo.limit!
  });
} 