'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '../dashboards/Sidebar';

interface SummaryResult {
  success: boolean;
  message?: string;
  readme?: string;
  summary?: string;
  cool_facts?: string[];
  error?: string;
}

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }

    // Validate GitHub URL format
    const githubUrlRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+(\/|$)/;
    if (!githubUrlRegex.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/owner/repo)');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({ githubUrl }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to summarize repository');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={session?.user}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header with menu button */}
        <div className="md:hidden bg-white border-b p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">GitHub Repository Summarizer</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your API key"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium text-gray-700">GitHub Repository URL</label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://github.com/owner/repository"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Summarizing...' : 'Summarize Repository'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && result.success && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">Repository summarized successfully!</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{result.summary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Cool Facts</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.cool_facts?.map((fact, index) => (
                    <li key={index} className="text-gray-700">{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
} 