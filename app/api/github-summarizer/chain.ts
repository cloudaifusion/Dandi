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

// LLM setup
const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

// Chain with strict structured output
const summarizerChain = summarizerPrompt.pipe(
  llm.withStructuredOutput(summarySchema, { name: "repo_summary" })
);

// Exported function to summarize README content
export async function summarizeReadme(readme: string): Promise<{ summary: string; cool_facts: string[] }> {
  const result = await summarizerChain.invoke({ readme });
  return {
    summary: result.summary,
    cool_facts: result.cool_facts,
  };
} 