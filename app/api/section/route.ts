import { NextRequest, NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idea, sectionTitle, sectionHint, currentDraft, instruction } = await req.json();
    if (!sectionTitle) {
      return NextResponse.json({ error: "Missing section title." }, { status: 400 });
    }

    const raw = await callGroq(
      [
        {
          role: "system",
          content:
            "You are a senior product manager editing one section of an existing PRD. " +
            "Output ONLY the rewritten section body — no headers, no preamble, no markdown bold. " +
            "Keep the same list-vs-prose format as the current draft.",
        },
        {
          role: "user",
          content:
            `Product idea: ${idea || "(not given)"}\n` +
            `Section: "${sectionTitle}" — ${sectionHint || ""}\n` +
            `Current draft:\n"""${currentDraft || "(empty)"}"""\n\n` +
            `Instruction: ${instruction || "Improve clarity and tighten the wording, same length."}`,
        },
      ],
      { temperature: 0.6 }
    );

    return NextResponse.json({ body: raw.trim() });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong regenerating this section." },
      { status: 500 }
    );
  }
}
