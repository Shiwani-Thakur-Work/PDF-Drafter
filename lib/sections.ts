export type SectionDef = { id: string; title: string; hint: string };

export const SECTIONS: SectionDef[] = [
  { id: "problem", title: "Problem statement", hint: "What problem exists today, for whom, and why it matters now." },
  { id: "goals", title: "Goals & success metrics", hint: "What this should achieve, and the metric(s) that prove it worked." },
  { id: "nongoals", title: "Non-goals", hint: "What this deliberately will not cover, to keep scope honest." },
  { id: "users", title: "Target users & personas", hint: "Who this is for, and what they do today instead." },
  { id: "stories", title: "User stories", hint: "As a ___, I want ___, so that ___ — short and concrete." },
  { id: "requirements", title: "Functional requirements", hint: "What the product must do — concrete, testable behaviors." },
  { id: "nfr", title: "Non-functional requirements", hint: "Performance, reliability, security, accessibility constraints." },
  { id: "scope", title: "Scope: MVP vs. later", hint: "What ships first; what is explicitly a later phase." },
  { id: "risks", title: "Risks & assumptions", hint: "What could go wrong, and what you're taking on faith." },
  { id: "timeline", title: "Timeline & milestones", hint: "Key phases or dates, even if approximate." },
  { id: "open", title: "Open questions", hint: "Unresolved items that need an answer before or during build." },
];

export type PrdSection = { id: string; title: string; body: string };
export type PrdDoc = {
  title: string;
  oneLiner: string;
  sections: PrdSection[];
};

export function prdToMarkdown(doc: PrdDoc, meta: { author?: string; status?: string }) {
  const dateStr = new Date().toISOString().slice(0, 10);
  let md = `# ${doc.title || "Untitled product"}\n\n`;
  if (doc.oneLiner) md += `_${doc.oneLiner}_\n\n`;
  md += `**Author:** ${meta.author || "—"}  \n**Status:** ${meta.status || "Draft"}  \n**Drafted:** ${dateStr}\n\n---\n\n`;
  doc.sections.forEach((s, i) => {
    md += `## ${i + 1}. ${s.title}\n\n${s.body?.trim() || "_Not filled in yet._"}\n\n`;
  });
  return md;
}
