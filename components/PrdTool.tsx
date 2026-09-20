"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXAMPLE_IDEAS, SAMPLE_IDEA, SAMPLE_QUESTIONS, SAMPLE_PRD } from "@/lib/examples";
import { prdToMarkdown, PrdDoc } from "@/lib/sections";

type Question = { id: string; question: string };
type Answer = { id: string; question: string; answer: string };
type Step = "idea" | "questions" | "result";

export default function PrdTool() {
  const [step, setStep] = useState<Step>("idea");
  const [idea, setIdea] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [doc, setDoc] = useState<PrdDoc | null>(null);
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regenId, setRegenId] = useState<string | null>(null);

  function handlePreviewSample() {
    setError(null);
    setIdea(SAMPLE_IDEA);
    setDoc(SAMPLE_PRD);
    setAuthor("Your name");
    setStep("result");
  }

  async function handleGenerateQuestions() {
    setError(null);
    if (idea.trim().length < 15) {
      setError("Give a bit more detail on the idea (15+ characters) so the questions are useful.");
      return;
    }
    setLoading("questions");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate questions.");
      setQuestions(data.questions);
      setStep("questions");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleGeneratePrd(skip = false) {
    setError(null);
    setLoading("prd");
    try {
      const answerList: Answer[] = questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: skip ? "" : answers[q.id] || "",
      }));
      const res = await fetch("/api/prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, answers: answerList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate the PRD.");
      setDoc(data);
      setStep("result");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleRegenerateSection(sectionId: string, instruction: string) {
    if (!doc) return;
    const section = doc.sections.find((s) => s.id === sectionId);
    if (!section) return;
    setRegenId(sectionId);
    setError(null);
    try {
      const res = await fetch("/api/section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          sectionTitle: section.title,
          currentDraft: section.body || "",
          instruction,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not regenerate this section.");
      setDoc({
        ...doc,
        sections: doc.sections.map((s) => (s.id === sectionId ? { ...s, body: data.body } : s)),
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRegenId(null);
    }
  }

  function updateSectionBody(sectionId: string, body: string) {
    if (!doc) return;
    setDoc({ ...doc, sections: doc.sections.map((s) => (s.id === sectionId ? { ...s, body } : s)) });
  }

  function handleDownload() {
    if (!doc) return;
    const md = prdToMarkdown(doc, { author, status });
    const filename =
      (doc.title || "prd-draft").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".md";
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    if (!doc) return;
    const md = prdToMarkdown(doc, { author, status });
    await navigator.clipboard.writeText(md);
  }

  function reset() {
    setStep("idea");
    setIdea("");
    setQuestions([]);
    setAnswers({});
    setDoc(null);
    setError(null);
  }

  return (
    <div id="tool" className="max-w-3xl mx-auto px-5 sm:px-6 pb-24">
      {error && (
        <div className="mb-5 border border-flag/40 bg-flag-soft text-flag text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {step === "idea" && (
            <div className="border border-line bg-paper-raised rounded-lg p-6 sm:p-8">
              <label htmlFor="idea" className="block text-xs uppercase tracking-wide text-muted mb-2">
                Describe your product idea
              </label>
              <textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={5}
                placeholder="e.g.  A mobile app that connects local dog walkers with busy pet owners in metropolitan areas..."
                className="w-full border border-line rounded-lg px-3 py-3 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">
                  {idea.trim().length < 15 ? `${15 - idea.trim().length} more characters needed` : "Looks good"}
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGenerateQuestions}
                  disabled={loading === "questions"}
                  className="bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading === "questions" ? "Thinking…" : "Get clarifying questions →"}
                </motion.button>
              </div>

              <div className="mt-6 pt-5 border-t border-line">
                <p className="text-xs text-muted mb-2.5">Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_IDEAS.map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => setIdea(ex.idea)}
                      className="text-xs border border-line rounded-full px-3.5 py-1.5 text-ink-soft hover:border-accent hover:text-accent transition"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePreviewSample}
                  className="mt-3 block text-xs text-accent underline underline-offset-2 hover:opacity-80"
                >
                  Just want to see the finished layout? Preview with sample data — no API key needed →
                </button>
                <button
                  onClick={() => {
                    setIdea(SAMPLE_IDEA);
                    setQuestions(SAMPLE_QUESTIONS);
                    setStep("questions");
                  }}
                  className="mt-1.5 block text-xs text-muted underline underline-offset-2 hover:text-ink"
                >
                  Or preview the clarifying-questions screen
                </button>
              </div>
            </div>
          )}

          {step === "questions" && (
            <div className="border border-line bg-paper-raised rounded-lg p-6 sm:p-8">
              <h2 className="text-xl font-semibold mb-1">A few clarifying questions</h2>
              <p className="text-sm text-muted mb-6">
                Answer what you can — skip anything you're not sure about yet.
              </p>
              <div className="space-y-5">
                {questions.map((q, i) => (
                  <div key={q.id}>
                    <label className="block text-sm text-ink-soft mb-1.5">
                      <span className="text-xs text-muted mr-2 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      {q.question}
                    </label>
                    <input
                      value={answers[q.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      className="w-full border border-line rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your answer (optional)"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-line">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGeneratePrd(false)}
                  disabled={loading === "prd"}
                  className="bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
                >
                  {loading === "prd" ? "Drafting your PRD…" : "Draft the full PRD →"}
                </motion.button>
                <button
                  onClick={() => handleGeneratePrd(true)}
                  disabled={loading === "prd"}
                  className="text-sm text-ink-soft hover:text-ink transition"
                >
                  Skip questions, draft anyway
                </button>
                <button onClick={() => setStep("idea")} className="text-sm text-muted hover:text-ink transition ml-auto">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {step === "result" && doc && (
            <div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-xs text-muted mb-1.5">Author</label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Your name"
                    className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper-raised focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1.5">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-paper-raised focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Draft</option>
                    <option>In review</option>
                    <option>Approved</option>
                    <option>Shipped</option>
                  </select>
                </div>
              </div>

              <div className="border border-line bg-paper-raised rounded-lg p-7 sm:p-9">
                <h1 className="text-2xl font-semibold mb-1">{doc.title}</h1>
                <p className="text-ink-soft text-sm mb-5">{doc.oneLiner}</p>

                {doc.sections.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                    className="py-5 border-t border-line first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-medium text-accent tracking-wide tabular-nums">
                        {String(i + 1).padStart(2, "0")} — {s.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerateSection(s.id, "Improve clarity and tighten the wording, same length.")}
                          disabled={regenId === s.id}
                          className="text-[11px] border border-line rounded-full px-2.5 py-1 text-ink-soft hover:border-accent hover:text-accent transition disabled:opacity-50"
                        >
                          {regenId === s.id ? "Working…" : "Tighten"}
                        </button>
                        <button
                          onClick={() => handleRegenerateSection(s.id, "Write a fresh version, different angle.")}
                          disabled={regenId === s.id}
                          className="text-[11px] border border-line rounded-full px-2.5 py-1 text-ink-soft hover:border-accent hover:text-accent transition disabled:opacity-50"
                        >
                          Regenerate
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={s.body || ""}
                      onChange={(e) => updateSectionBody(s.id, e.target.value)}
                      rows={Math.max(3, Math.ceil((s.body || "").length / 70))}
                      className="w-full text-[14.5px] leading-relaxed border border-transparent hover:border-line focus:border-line rounded-lg px-2 py-1.5 -mx-2 focus:outline-none focus:ring-2 focus:ring-accent bg-transparent resize-y"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  className="bg-accent text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  Download as Markdown
                </motion.button>
                <button
                  onClick={handleCopy}
                  className="border border-line text-sm px-5 py-2.5 rounded-lg hover:border-ink-soft transition"
                >
                  Copy to clipboard
                </button>
                <button onClick={reset} className="text-sm text-muted hover:text-ink transition ml-auto">
                  Start a new PRD
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
