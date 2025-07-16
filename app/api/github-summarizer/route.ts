import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../supabase';

export async function POST(request: NextRequest) {
  try {
    const { githubUrl } = await request.json();
    // Get apiKey only from x-api-key header
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'apiKey is required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single();
    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive API key' }, { status: 401 });
    }
     // Fetch the README.md content
     const readmeContent = await fetchReadme(githubUrl);

     if (!readmeContent) {
       return NextResponse.json(
         { success: false, error: "Could not fetch README.md from repository" },
         { status: 404 }
       );
     }
 
     // Placeholder for actual summarizer logic, now with readmeContent
     // Refactored: Call summarizer logic from chain.ts
     const { summarizeReadme } = await import("./chain");
     const summaryResult = await summarizeReadme(readmeContent);
     return NextResponse.json(
       {
         success: true,
         message: "API key validated. Summarizer logic goes here.",
         readme: readmeContent,
         summary: summaryResult.summary,
         cool_facts: summaryResult.cool_facts,
       },
       { status: 200 }
     );
    
  } catch (err) {
    console.error('Error in github-summarizer POST:', err);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
    // Helper function to fetch README.md content from a GitHub repo
    async function fetchReadme(githubUrl: string): Promise<string | null> {
      try {
        // Parse the githubUrl to extract owner and repo
        const match = githubUrl.match(
          /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/
        );
        if (!match) return null;
        const owner = match[1];
        const repo = match[2];

        // Try to fetch README.md from main or master branch
        const branches = ["main", "master"];
        for (const branch of branches) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
          const res = await fetch(rawUrl);
          if (res.ok) {
            return await res.text();
          }
        }
        return null;
      } catch (e) {
        return null;
      }
    }
 

   
  // Yes, the README file is handled correctly:
  // - The fetchReadme function parses the GitHub URL to extract the owner and repo.
  // - It attempts to fetch the README.md file from both the "main" and "master" branches using the raw.githubusercontent.com URL.
  // - If the README.md is found (HTTP 200), it returns the file content as text.
  // - If not found or an error occurs, it returns null.
  // - The main handler checks if readmeContent is null and returns a 404 error if so.
  // - Otherwise, it includes the README content in the JSON response.
  // This approach covers the common cases for public repositories with a README.md in the root of the main or master branch.
  }  