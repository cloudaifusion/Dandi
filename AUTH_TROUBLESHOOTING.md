# Google OAuth Authentication Troubleshooting

## Error: AccessDenied (403)

If you're getting an "AccessDenied" error during Google OAuth authentication, follow these steps:

## 1. Check Google Cloud Console Configuration

### OAuth 2.0 Client ID Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID and click on it

### Authorized JavaScript origins
Add these URLs:
```
http://localhost:3000
https://yourdomain.com (if deployed)
```

### Authorized redirect URIs
Add these URLs:
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google (if deployed)
```

## 2. Environment Variables

Make sure your `.env.local` file has all required variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 3. Generate NEXTAUTH_SECRET

If you don't have a NEXTAUTH_SECRET, generate one:

```bash
openssl rand -base64 32
```

## 4. Check Google OAuth API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Library"
3. Search for "Google+ API" or "Google OAuth2 API"
4. Make sure it's enabled

## 5. Test Configuration

### Development Testing
1. Clear your browser cache and cookies
2. Restart your Next.js development server
3. Try signing in again

### Debug Mode
The updated NextAuth configuration includes debug mode in development. Check your console for detailed error messages.

## 6. Common Issues

### Issue: "Invalid redirect_uri"
- **Solution**: Double-check your redirect URIs in Google Cloud Console
- Make sure there are no trailing slashes or typos

### Issue: "Client ID not found"
- **Solution**: Verify your GOOGLE_CLIENT_ID matches exactly
- Copy from Google Cloud Console, not from a screenshot

### Issue: "Access blocked"
- **Solution**: Check if your Google account has any restrictions
- Try with a different Google account

### Issue: Database errors
- **Solution**: Check your Supabase connection
- Verify the `users` table exists and has the correct schema

## 7. Database Schema

Make sure your Supabase `users` table has this structure:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 8. Testing Steps

1. **Test Google OAuth directly**:
   - Visit: `http://localhost:3000/api/auth/signin`
   - Click "Sign in with Google"

2. **Check network tab**:
   - Open browser dev tools
   - Go to Network tab
   - Try signing in and look for failed requests

3. **Check server logs**:
   - Look at your Next.js console output
   - Check for any error messages

## 9. Still Having Issues?

If you're still experiencing problems:

1. **Check the error page**: Visit `/auth/error` to see detailed error information
2. **Enable debug mode**: Set `NODE_ENV=development` to see detailed logs
3. **Test with minimal config**: Temporarily remove the Supabase integration to isolate the issue

## 10. Alternative: Use Test Credentials

For testing purposes, you can create a test OAuth app:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add test users in the OAuth consent screen

This will help isolate whether the issue is with your main OAuth app or something else. 