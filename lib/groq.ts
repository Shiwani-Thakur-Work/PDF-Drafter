import { jsonrepair } from "jsonrepair";

type GroqMessage = { role: "system" | "user" | "assistant"; content: string };

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Calls Groq's OpenAI-compatible chat completions endpoint.
 * When `json` is true, asks the model for a raw JSON object and
 * defensively extracts it even if the model wraps it in prose.
 */
export async function callGroq(
  messages: GroqMessage[],
  opts: { json?: boolean; temperature?: number } = {}
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GROQ_API_KEY. Add it to .env.local (see .env.example) or your Netlify site's environment variables."
    );
  }

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.6,
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");

    if (res.status === 400 && errText.includes("json_validate_failed")) {
      try {
        const errJson = JSON.parse(errText);
        const failedGeneration: unknown = errJson?.error?.failed_generation;
        if (typeof failedGeneration === "string" && failedGeneration.trim()) {
          return repairJsonString(failedGeneration);
        }
      } catch {
        // Fall through to the generic error below.
      }
    }

    if (res.status === 404) {
      throw new Error(
        `Groq model "${model}" isn't available on your account (404). Groq's free-tier model lineup ` +
        `changes over time — check https://console.groq.com/docs/models for what's currently open, ` +
        `then set GROQ_MODEL in .env.local (or your Netlify env vars) to a valid model ID.`
      );
    }
    throw new Error(`Groq API error (${res.status}): ${errText || res.statusText}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Groq returned an empty response.");
  return content;
}

function fixDoubledClosingBrace(str: string): string {
  return str.replace(/\}\}(\s*,\s*\{\s*"id"\s*:)/g, "}$1");
}

function repairJsonString(raw: string): string {
  const attempts = [
    raw,
    (raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/) || [raw])[0],
  ];
  for (const candidate of attempts) {
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      const fixed = fixDoubledClosingBrace(candidate);
      try {
        JSON.parse(fixed);
        return fixed;
      } catch {
        try {
          const repaired = jsonrepair(fixed);
          JSON.parse(repaired);
          return repaired;
        } catch {
          // try the next candidate
        }
      }
    }
  }
  throw new Error("Could not parse JSON from model response.");
}

export function extractJson<T = unknown>(raw: string): T {
  return JSON.parse(repairJsonString(raw)) as T;
}