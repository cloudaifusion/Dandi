import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, createRateLimitedResponse } from '../../../lib/rate-limiting';

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

// Main handler function (without rate limiting)
async function handleGitHubSummarizer(
  request: NextRequest,
  rateLimitInfo: any
): Promise<NextResponse> {
  try {
    const { githubUrl } = await request.json();
    
    // Fetch the README.md content
    const readmeContent = await fetchReadme(githubUrl);

    if (!readmeContent) {
      return NextResponse.json(
        { success: false, error: "Could not fetch README.md from repository" },
        { status: 404 }
      );
    }

    // Call summarizer logic from chain.ts
    const { summarizeReadme } = await import("./chain");
    const summaryResult = await summarizeReadme(readmeContent);
    
    const responseData = {
      success: true,
      message: "API key validated. Summarizer logic goes here.",
      readme: readmeContent,
      summary: summaryResult.summary,
      cool_facts: summaryResult.cool_facts,
    };

    // Create response with rate limit info included
    return createRateLimitedResponse(responseData, rateLimitInfo);
    
  } catch (err) {
    console.error('Error in github-summarizer POST:', err);
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

// Export the rate-limited version of the handler
export const POST = withRateLimit(handleGitHubSummarizer, {
  endpoint: 'github-summarizer',
  incrementBy: 1
});  