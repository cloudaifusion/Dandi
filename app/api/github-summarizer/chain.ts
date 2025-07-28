import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Strict Zod schema for the structured output
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the repository"),
  cool_facts: z
    .array(z.string())
    .min(1)
    .describe("A list of cool or interesting facts about the repository"),
});

// Prompt template for summarization
const summarizerPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Summarize this GitHub repository from this readme file content. Your response should include a concise summary and a list of cool or interesting facts about the repository."
  ],
  ["human", "{readme}"],
]);

// LLM setup - check if OpenAI API key is available
let llm: ChatOpenAI | null = null;
let summarizerChain: any = null;

try {
  if (process.env.OPENAI_API_KEY) {
    llm = new ChatOpenAI({
      model: "gpt-4o",
      temperature: 0,
    });

    // Chain with strict structured output
    summarizerChain = summarizerPrompt.pipe(
      llm.withStructuredOutput(summarySchema, { name: "repo_summary" })
    );
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// Exported function to summarize README content
export async function summarizeReadme(readme: string): Promise<{ summary: string; cool_facts: string[] }> {
  if (!summarizerChain) {
    // Fallback response when OpenAI is not configured
    return {
      summary: "This repository appears to be a software project. Please configure OPENAI_API_KEY environment variable to get AI-powered summaries.",
      cool_facts: [
        "AI summarization requires OpenAI API key configuration",
        "The README content was successfully fetched from the repository",
        "This is a fallback response due to missing API configuration"
      ],
    };
  }

  try {
    const result = await summarizerChain.invoke({ readme });
    return {
      summary: result.summary,
      cool_facts: result.cool_facts,
    };
  } catch (error) {
    console.error('Error in AI summarization:', error);
    // Return a fallback response if AI summarization fails
    return {
      summary: "Unable to generate AI summary at this time. The README content was successfully retrieved from the repository.",
      cool_facts: [
        "The repository README was successfully fetched",
        "AI summarization encountered an error",
        "Please check your OpenAI API configuration"
      ],
    };
  }
} 