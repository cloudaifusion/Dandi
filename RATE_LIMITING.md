# Rate Limiting Implementation

## Overview

This implementation provides a **reusable rate limiting system** that can be applied to any API endpoint. The rate limiting is implemented as a utility library that can be easily integrated into new endpoints without duplicating code.

## Key Features

- ✅ **Reusable**: Single implementation that works across all endpoints
- ✅ **Configurable**: Different endpoints can have different usage costs
- ✅ **Type-safe**: Full TypeScript support with proper interfaces
- ✅ **Atomic**: Database updates are atomic to prevent race conditions
- ✅ **Flexible**: Supports different increment values per endpoint

## Database Changes

### New Columns Added to `api_keys` Table

1. **`usage`** (INTEGER, DEFAULT 0)
   - Tracks the current number of API requests made with this key
   - Automatically incremented on each successful request

2. **`limit`** (INTEGER, DEFAULT 1000)
   - Sets the maximum number of requests allowed for this API key
   - Can be customized per API key

### Database Migration

Run the following SQL in your Supabase database:

```sql
-- Add usage column to track current API usage (defaults to 0)
ALTER TABLE api_keys ADD COLUMN usage INTEGER DEFAULT 0;

-- Add limit column to set rate limit (defaults to 1000 requests)
ALTER TABLE api_keys ADD COLUMN "limit" INTEGER DEFAULT 1000;

-- Create index for better query performance on usage tracking
CREATE INDEX idx_api_keys_usage ON api_keys(usage);
CREATE INDEX idx_api_keys_limit ON api_keys("limit");
```

## Reusable Rate Limiting Utility

### Core Functions

The rate limiting is implemented in `lib/rate-limiting.ts` with the following functions:

#### `checkRateLimit(apiKey, config)`
- Validates API key and checks rate limits
- Returns `RateLimitResult` with success status and usage info

#### `withRateLimit(handler, config)`
- Higher-order function that wraps API handlers
- Automatically handles API key validation and rate limiting
- Returns a rate-limited version of your handler

#### `createRateLimitedResponse(data, rateLimitInfo)`
- Utility to create responses with rate limit information included

### Configuration Options

```typescript
interface RateLimitConfig {
  endpoint: string;        // Name of the endpoint for logging
  incrementBy?: number;    // How much to increment usage (default: 1)
}
```

## Implementing Rate Limiting for New Endpoints

### Method 1: Using the Higher-Order Function (Recommended)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

// Your main handler function (without rate limiting)
async function handleMyEndpoint(
  request: NextRequest,
  rateLimitInfo: any
): Promise<NextResponse> {
  try {
    const { data } = await request.json();
    
    // Your endpoint logic here
    const result = {
      success: true,
      message: "Request processed successfully",
      data: data
    };

    // Include rate limit info in response
    return createRateLimitedResponse(result, rateLimitInfo);
    
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

// Export the rate-limited version
export const POST = withRateLimit(handleMyEndpoint, {
  endpoint: 'my-endpoint',
  incrementBy: 1 // Standard cost
});
```

### Method 2: Manual Implementation

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key required' }, { status: 400 });
  }

  // Check rate limit
  const rateLimitResult = await checkRateLimit(apiKey, {
    endpoint: 'my-endpoint',
    incrementBy: 2 // This endpoint costs more
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

  // Your endpoint logic here
  const result = { success: true, data: "processed" };
  
  return createRateLimitedResponse(result, rateLimitResult);
}
```

## Different Usage Costs per Endpoint

You can set different `incrementBy` values for different endpoints:

```typescript
// Lightweight endpoint (costs 0.5)
export const GET = withRateLimit(handler, {
  endpoint: 'status-check',
  incrementBy: 0.5
});

// Standard endpoint (costs 1)
export const POST = withRateLimit(handler, {
  endpoint: 'data-processor',
  incrementBy: 1
});

// Heavy endpoint (costs 5)
export const POST = withRateLimit(handler, {
  endpoint: 'ai-analysis',
  incrementBy: 5
});
```

## API Changes

### `/api/github-summarizer` Endpoint

**Refactored to use reusable rate limiting:**
- Now uses `withRateLimit` wrapper
- Cleaner separation of concerns
- Rate limiting logic is reusable

**Response Format:**
```json
{
  "success": true,
  "message": "API key validated. Summarizer logic goes here.",
  "readme": "...",
  "summary": "...",
  "cool_facts": [...],
  "usage": 25,
  "limit": 1000
}
```

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "usage": 1000,
  "limit": 1000
}
```

### `/api/keys` Endpoint

**POST /api/keys**
- Now accepts a `limit` parameter when creating new API keys
- Default limit is 1000 if not specified
- Validates that limit is a positive number

**Request Body:**
```json
{
  "name": "My API Key",
  "status": "active",
  "limit": 500
}
```

### `/api/keys/[id]` Endpoint

**PUT /api/keys/[id]**
- Now accepts a `limit` parameter when updating API keys
- Validates that limit is a positive number

**Request Body:**
```json
{
  "name": "Updated Name",
  "status": "active",
  "limit": 2000
}
```

## Frontend Changes

### API Key Management

1. **API Key Table**
   - Added "Limit" column to display rate limits
   - Shows current usage vs limit

2. **API Key Modal**
   - Added "Rate Limit" field for creating/editing API keys
   - Input validation for positive numbers
   - Default value of 1000

3. **TypeScript Interfaces**
   - Updated `ApiKey` interface to include `limit` field
   - Updated form data types to include limit

## Usage Examples

### Creating an API Key with Custom Limit

```javascript
const response = await fetch('/api/keys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'High Volume API Key',
    status: 'active',
    limit: 5000
  }),
});
```

### Making API Requests

```javascript
const response = await fetch('/api/github-summarizer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk-your-api-key-here'
  },
  body: JSON.stringify({
    githubUrl: 'https://github.com/facebook/react'
  })
});

const data = await response.json();

if (response.status === 429) {
  console.log('Rate limit exceeded:', data.error);
  console.log(`Usage: ${data.usage}/${data.limit}`);
} else {
  console.log('Request successful');
  console.log(`Current usage: ${data.usage}/${data.limit}`);
}
```

### Updating API Key Limit

```javascript
const response = await fetch(`/api/keys/${apiKeyId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Name',
    limit: 3000
  }),
});
```

## Testing

Use the provided test script to verify rate limiting functionality:

1. Update `test-rate-limiting.js` with your API key
2. Run the test: `node test-rate-limiting.js`
3. Check the database to verify usage is being incremented

## Security Considerations

1. **Atomic Updates**: Usage is incremented atomically to prevent race conditions
2. **Validation**: All limit values are validated as positive numbers
3. **User Scoping**: API keys are user-scoped, preventing unauthorized access
4. **Error Handling**: Proper error responses for invalid requests
5. **Reusable**: Single implementation reduces attack surface and maintenance burden

## Monitoring

- Monitor usage patterns in the database
- Set up alerts for API keys approaching their limits
- Consider implementing usage analytics and reporting
- Track usage by endpoint to understand resource consumption

## Future Enhancements

1. **Time-based Limits**: Add daily/monthly rate limits
2. **Usage Reset**: Implement automatic usage reset (e.g., monthly)
3. **Tiered Limits**: Different limits based on user plans
4. **Usage Analytics**: Detailed usage reporting and analytics
5. **Rate Limit Headers**: Add rate limit headers to responses
6. **Endpoint-specific Limits**: Different limits for different endpoints per API key
7. **Usage Quotas**: Implement usage quotas with automatic reset periods 