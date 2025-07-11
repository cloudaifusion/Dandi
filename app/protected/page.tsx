'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Notification from '../dashboards/Notification';

function ProtectedContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get('apiKey');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateKey = async () => {
      if (!apiKey) return;
      setLoading(true);
      // Dynamically import supabase client to avoid SSR issues
      const { supabase } = await import('../api/supabase');
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('status', 'active')
        .single();
      if (error || !data) {
        setNotification({ message: 'Invalid API Key', type: 'error' });
      } else {
        setNotification({ message: 'valid API key, /protected can be accessed', type: 'success' });
      }
      setLoading(false);
    };
    validateKey();
  }, [apiKey]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-20">
        <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
        <p>This page is protected by API key validation.</p>
        {loading && <p className="mt-4 text-gray-500">Validating API key...</p>}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-20">
        <h1 className="text-2xl font-bold mb-6">Protected Page</h1>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default function Protected() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProtectedContent />
    </Suspense>
  );
} 