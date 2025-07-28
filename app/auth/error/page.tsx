'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return 'Access was denied. Please check your Google account permissions.';
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/auth"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 text-center"
          >
            Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              <strong>Debug Info:</strong> Error code: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 