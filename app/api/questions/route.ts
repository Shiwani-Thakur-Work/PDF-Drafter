import { NextRequest, NextResponse } from "next/server";
import { callGroq, extractJson } from "@/lib/groq";

export const runtime = "nodejs";

type QuestionsResponse = { questions: { id: string; question: string }[] };

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string" || idea.trim().length < 15) {
      return NextResponse.json(
        { error: "Describe the product idea in a bit more detail (15+ characters)." },
        { status: 400 }
      );
    }

    const raw = await callGroq(
      [
        {
          role: "system",
          content:
            "You are a senior product manager helping a PM scope a new feature before writing a PRD. " +
            "Given a rough product idea, ask 5 short, specific clarifying questions that would materially change " +
            "how the PRD gets written (target user, core metric, platform, constraints, scope boundary, etc). " +
            'Respond with ONLY a JSON object of the exact shape: {"questions":[{"id":"q1","question":"..."}]}. ' +
            "No prose before or after the JSON.",
        },
        { role: "user", content: `Product idea: ${idea}` },
      ],
      { json: true, temperature: 0.5 }
    );

    const parsed = extractJson<QuestionsResponse>(raw);
    if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Model did not return usable questions.");
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong generating questions." },
      { status: 500 }
    );
  }
}
