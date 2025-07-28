# Reusable Rate Limiting System

## 🎯 Overview

The rate limiting system has been refactored to be **completely reusable** across all API endpoints. Instead of duplicating rate limiting logic in each endpoint, you now have a single, well-tested implementation that can be easily applied to any new endpoint.

## 🚀 Quick Start

### Adding Rate Limiting to a New Endpoint

**Option 1: Using the Higher-Order Function (Recommended)**

```typescript
// app/api/my-new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

// Your main handler function
async function handleMyEndpoint(request: NextRequest, rateLimitInfo: any) {
  const { data } = await request.json();
  
  // Your endpoint logic here
  const result = {
    success: true,
    message: "Request processed successfully",
    data: data
  };

  return createRateLimitedResponse(result, rateLimitInfo);
}

// Export the rate-limited version
export const POST = withRateLimit(handleMyEndpoint, {
  endpoint: 'my-new-endpoint',
  incrementBy: 1
});
```

**Option 2: Using Helper Templates**

```typescript
// app/api/status/route.ts
import { createSimpleGetEndpoint } from '../../../lib/rate-limit-helper';

export const GET = createSimpleGetEndpoint('status-check', 0.5);
```

## 📚 Available Utilities

### Core Functions (`lib/rate-limiting.ts`)

- `checkRateLimit(apiKey, config)` - Manual rate limit checking
- `withRateLimit(handler, config)` - Higher-order function wrapper
- `createRateLimitedResponse(data, rateLimitInfo)` - Response helper

### Helper Templates (`lib/rate-limit-helper.ts`)

- `createSimpleGetEndpoint(name, incrementBy)` - For simple GET endpoints
- `createDataProcessingEndpoint(name, incrementBy)` - For data processing
- `ENDPOINT_CONFIGS` - Predefined configurations (LIGHTWEIGHT, STANDARD, HEAVY, PREMIUM)

## 🎛️ Configuration Options

### Different Usage Costs

```typescript
// Lightweight endpoint (status checks, simple queries)
export const GET = withRateLimit(handler, {
  endpoint: 'status-check',
  incrementBy: 0.5
});

// Standard endpoint (data processing, CRUD operations)
export const POST = withRateLimit(handler, {
  endpoint: 'data-processor',
  incrementBy: 1
});

// Heavy endpoint (AI processing, complex calculations)
export const POST = withRateLimit(handler, {
  endpoint: 'ai-analysis',
  incrementBy: 5
});

// Premium endpoint (very resource intensive)
export const POST = withRateLimit(handler, {
  endpoint: 'large-ai-model',
  incrementBy: 10
});
```

## 🔄 Migration from Old Implementation

### Before (Embedded Rate Limiting)
```typescript
export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key required' }, { status: 400 });
  }
  
  // Manual rate limiting logic...
  const { data, error } = await supabaseClient
    .from('api_keys')
    .select('*')
    .eq('key', apiKey)
    .eq('status', 'active')
    .single();
  
  // More manual logic...
  
  // Your actual endpoint logic
  const result = { success: true, data: "processed" };
  return NextResponse.json(result);
}
```

### After (Reusable Rate Limiting)
```typescript
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

async function handleEndpoint(request: NextRequest, rateLimitInfo: any) {
  // Your actual endpoint logic (no rate limiting code needed!)
  const result = { success: true, data: "processed" };
  return createRateLimitedResponse(result, rateLimitInfo);
}

export const POST = withRateLimit(handleEndpoint, {
  endpoint: 'my-endpoint',
  incrementBy: 1
});
```

## 📋 Common Patterns

### Multiple HTTP Methods
```typescript
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
```

### Error Handling
```typescript
async function handleEndpoint(request: NextRequest, rateLimitInfo: any) {
  try {
    const { data } = await request.json();
    
    if (!data) {
      return NextResponse.json({ success: false, error: 'Data required' }, { status: 400 });
    }
    
    const result = { success: true, data: "processed" };
    return createRateLimitedResponse(result, rateLimitInfo);
    
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
```

## 🎯 Benefits of Reusable Implementation

### ✅ **DRY Principle**
- Single implementation, used everywhere
- No code duplication
- Easier maintenance

### ✅ **Consistency**
- Same rate limiting behavior across all endpoints
- Consistent error messages and response formats
- Uniform logging and monitoring

### ✅ **Type Safety**
- Full TypeScript support
- Proper interfaces and type checking
- Better developer experience

### ✅ **Flexibility**
- Different usage costs per endpoint
- Easy to configure and customize
- Supports both automatic and manual usage

### ✅ **Testing**
- Single implementation to test
- Easier to write comprehensive tests
- Better test coverage

### ✅ **Security**
- Centralized security logic
- Consistent validation
- Reduced attack surface

## 🔧 Advanced Usage

### Manual Rate Limiting (When You Need More Control)
```typescript
import { checkRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'API key required' }, { status: 400 });
  }

  // Custom rate limiting logic
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
```

### Using Predefined Configurations
```typescript
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';
import { ENDPOINT_CONFIGS } from '../../../lib/rate-limit-helper';

// Using predefined configurations
export const GET = withRateLimit(handler, {
  endpoint: 'status-check',
  ...ENDPOINT_CONFIGS.LIGHTWEIGHT
});

export const POST = withRateLimit(handler, {
  endpoint: 'ai-analysis',
  ...ENDPOINT_CONFIGS.HEAVY
});
```

## 📊 Response Format

All rate-limited endpoints automatically include usage information:

```json
{
  "success": true,
  "data": "your endpoint data",
  "usage": 25,
  "limit": 1000
}
```

Rate limit exceeded responses:
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "usage": 1000,
  "limit": 1000
}
```

## 🚀 Getting Started Checklist

1. ✅ **Database Migration**: Run the SQL from `database-migration.sql`
2. ✅ **Import Utilities**: Import from `lib/rate-limiting.ts`
3. ✅ **Wrap Your Handler**: Use `withRateLimit()` or helper functions
4. ✅ **Include Rate Limit Info**: Use `createRateLimitedResponse()`
5. ✅ **Test Your Endpoint**: Verify rate limiting works correctly

## 📖 Additional Resources

- **Full Documentation**: See `RATE_LIMITING.md` for complete details
- **Examples**: Check `app/api/example-endpoint/route.ts` for working examples
- **Helper Functions**: Explore `lib/rate-limit-helper.ts` for templates
- **Test Script**: Use `test-rate-limiting.js` to verify functionality

---

**The rate limiting system is now completely reusable and ready for any new endpoints you create!** 🎉 