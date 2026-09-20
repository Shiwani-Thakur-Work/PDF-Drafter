import { NextRequest, NextResponse } from "next/server";
import { callGroq, extractJson } from "@/lib/groq";
import { SECTIONS, PrdDoc } from "@/lib/sections";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { idea, answers } = await req.json();
    if (!idea || typeof idea !== "string") {
      return NextResponse.json({ error: "Missing product idea." }, { status: 400 });
    }

    const qaText = Array.isArray(answers) && answers.length
      ? answers.map((a: { question: string; answer: string }) => `Q: ${a.question}\nA: ${a.answer || "(skipped)"}`).join("\n\n")
      : "(no clarifying answers given — use reasonable judgment and keep those parts general)";

    const sectionList = SECTIONS.map((s) => `- id: "${s.id}", title: "${s.title}" — ${s.hint}`).join("\n");

    const raw = await callGroq(
      [
        {
          role: "system",
          content:
            "You are a senior product manager writing a complete, professional PRD (Product Requirements Document). " +
            "Write in plain, direct PM tone — no filler, no marketing language. Use short bulleted lines (starting with '- ') " +
            "for sections that are naturally lists (user stories, requirements, non-functional requirements, risks, timeline, open questions), " +
            "and short prose (3-6 sentences) for narrative sections (problem, goals, non-goals, users, scope). " +
            'Respond with ONLY a JSON object of this exact shape: ' +
            '{"title":"...","oneLiner":"...","sections":[{"id":"problem","title":"Problem statement","body":"..."}, ...]}. ' +
            `Include exactly these sections, in this order:\n${sectionList}\n` +
            "No prose before or after the JSON. Do not include markdown headers inside body text.",
        },
        {
          role: "user",
          content: `Product idea:\n${idea}\n\nClarifying Q&A:\n${qaText}`,
        },
      ],
      { json: true, temperature: 0.6 }
    );

    const parsed = extractJson<{
      title?: string;
      oneLiner?: string;
      sections?: ({ id?: string; title?: string; body?: string } | null)[];
    }>(raw);
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error("Model did not return a usable PRD.");
    }

    // Different models format this JSON slightly differently (a missing "body" on one
    // section, a stray null, sections out of order, etc). Rebuild against the canonical
    // SECTIONS list so the client always gets exactly these 11 sections, in order, each
    // with a real string body — never undefined.
    const byId = new Map(
      parsed.sections.filter(Boolean).map((s) => [s!.id, s!])
    );
    const normalized: PrdDoc = {
      title: (parsed.title || "").trim() || "Untitled product",
      oneLiner: (parsed.oneLiner || "").trim(),
      sections: SECTIONS.map((def) => {
        const match = byId.get(def.id);
        return {
          id: def.id,
          title: def.title,
          body: typeof match?.body === "string" ? match.body : "",
        };
      }),
    };

    return NextResponse.json(normalized);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Something went wrong generating the PRD." },
      { status: 500 }
    );
  }
}
