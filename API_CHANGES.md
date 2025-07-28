# API Changes Documentation

## Overview
The CRUD functionality for API keys has been moved to authenticated REST endpoints with user-specific access control.

## Changes Made

### 1. Authentication & Authorization
- All API key operations now require user authentication via NextAuth
- Each user can only access their own API keys
- User ID is retrieved from JWT session and matched against Supabase users table

### 2. New API Endpoints

#### GET /api/keys
- **Authentication**: Required
- **Description**: Get all API keys for the authenticated user
- **Response**: Array of API keys belonging to the user

#### POST /api/keys
- **Authentication**: Required
- **Description**: Create a new API key for the authenticated user
- **Body**: `{ name: string, status?: 'active' | 'inactive' }`
- **Response**: Created API key object

#### GET /api/keys/[id]
- **Authentication**: Required
- **Description**: Get a specific API key by ID (user must own the key)
- **Response**: API key object or 404 if not found/not owned

#### PUT /api/keys/[id]
- **Authentication**: Required
- **Description**: Update a specific API key by ID (user must own the key)
- **Body**: `{ name?: string, status?: 'active' | 'inactive' }`
- **Response**: Updated API key object

#### DELETE /api/keys/[id]
- **Authentication**: Required
- **Description**: Delete a specific API key by ID (user must own the key)
- **Response**: Deleted API key object

### 3. Database Changes
- Added `user_id` column to `api_keys` table
- Created foreign key relationship with `users` table
- Added index for better query performance

### 4. Security Improvements
- Using server-side Supabase client with service role key
- All operations are user-scoped
- Ownership verification for individual operations

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# New variable for server-side operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database Migration

Run the following SQL in your Supabase database:

```sql
-- Add user_id column to api_keys table
ALTER TABLE api_keys ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
```

## Frontend Changes

The frontend has been updated to use the new [id] endpoints:
- Update operations now use `PUT /api/keys/[id]`
- Delete operations now use `DELETE /api/keys/[id]`
- All operations require user authentication

## Usage Examples

### Creating an API Key
```javascript
const response = await fetch('/api/keys', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My API Key',
    status: 'active'
  }),
});
```

### Updating an API Key
```javascript
const response = await fetch(`/api/keys/${apiKeyId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Updated Name',
    status: 'inactive'
  }),
});
```

### Deleting an API Key
```javascript
const response = await fetch(`/api/keys/${apiKeyId}`, {
  method: 'DELETE',
});
```

## Security Notes

1. All API key operations are now user-scoped
2. Users can only access their own API keys
3. Server-side Supabase client provides better security
4. Authentication is required for all operations
5. Ownership verification prevents unauthorized access 