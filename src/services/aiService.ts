import axios from "axios";
import type { Lead } from "../lib/types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

interface QualificationResponse {
  score: number;
  status: "qualified" | "disqualified" | "reviewing";
  reasoning: string;
  signals: {
    hasBudget: boolean;
    hasTimeline: boolean;
    hasAuthority: boolean;
    hasNeed: boolean;
  };
  extractedData: {
    budgetRange?: string;
    timeline?: string;
    role?: string;
    painPoints: string[];
  };
}

const QUALIFICATION_PROMPT = `You are a sales lead qualification expert. Analyze the following lead and determine if they're worth pursuing.

LEAD INFORMATION:
Source: {source}
Name: {name}
Company: {company}
Email: {email}
Message: {message}

QUALIFICATION CRITERIA (BANT Framework):
1. Budget - Do they mention or imply budget/financial capacity?
2. Authority - Are they a decision-maker (titles like CEO, CTO, Director, Manager)?
3. Need - Do they describe a clear problem or pain point?
4. Timeline - Do they mention urgency or a deadline?

SCORING GUIDE:
- 80-100: Strong lead (3-4 BANT criteria met, clear intent)
- 60-79: Moderate lead (2 BANT criteria met, some potential)
- 40-59: Weak lead (1 BANT criterion met, vague interest)
- 0-39: Poor lead (no clear criteria, tire-kicker)

Return ONLY a valid JSON object with this exact structure:
{
  "score": <number 0-100>,
  "status": "<qualified|disqualified|reviewing>",
  "reasoning": "<1 concise sentence explaining the score>",
  "signals": {
    "hasBudget": <boolean>,
    "hasTimeline": <boolean>,
    "hasAuthority": <boolean>,
    "hasNeed": <boolean>
  },
  "extractedData": {
    "budgetRange": "<extracted budget or null>",
    "timeline": "<extracted timeline or null>",
    "role": "<inferred role/title or null>",
    "painPoints": ["<pain point 1>", "<pain point 2>"]
  }
}

STATUS RULES:
- "qualified": score >= 70
- "disqualified": score < 40
- "reviewing": score 40-69`;

function buildPrompt(lead: Lead): string {
  return QUALIFICATION_PROMPT.replace("{source}", lead.source)
    .replace("{name}", lead.rawData.name || "Not provided")
    .replace("{company}", lead.rawData.company || "Not provided")
    .replace("{email}", lead.rawData.email || "Not provided")
    .replace("{message}", lead.rawData.message);
}

// Add this helper function at the top
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

// Update qualifyLead to use retry logic
export async function qualifyLead(lead: Lead): Promise<Lead["qualification"]> {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = buildPrompt(lead);

  return retryWithBackoff(async () => {
    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a sales lead qualification assistant. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const parsed: QualificationResponse = JSON.parse(content);

    if (
      typeof parsed.score !== "number" ||
      !parsed.status ||
      !parsed.reasoning
    ) {
      throw new Error("Invalid AI response structure");
    }

    return parsed;
  });
}

// Batch processing with rate limiting
export async function qualifyLeadsBatch(
  leads: Lead[],
  onProgress?: (processed: number, total: number) => void
): Promise<Map<string, Lead["qualification"]>> {
  const results = new Map<string, Lead["qualification"]>();

  for (let i = 0; i < leads.length; i++) {
    try {
      const qualification = await qualifyLead(leads[i]);
      results.set(leads[i].id, qualification);

      if (onProgress) {
        onProgress(i + 1, leads.length);
      }

      // Rate limiting: wait 1 second between requests
      if (i < leads.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to qualify lead ${leads[i].id}:`, error);
      // Continue with next lead instead of failing entire batch
    }
  }

  return results;
}
