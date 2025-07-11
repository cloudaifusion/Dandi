'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      router.push(`/protected?apiKey=${encodeURIComponent(apiKey)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">API Playground</h1>
        <label className="block mb-2 font-medium">API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Enter your API key"
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Submit</button>
      </form>
    </div>
  );
} 