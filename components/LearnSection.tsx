"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SECTIONS } from "@/lib/sections";

const TABS = ["What's a PRD?", "How to write one", "PRD vs BRD", "FAQ"] as const;
type Tab = (typeof TABS)[number];

const HOW_TO_STEPS = [
  { title: "Start with the problem, not the solution", body: "Write the problem statement before you sketch any UI. If you can't state who's affected and why it matters, it's too early to scope requirements." },
  { title: "Talk to a few real users first", body: "Three to five conversations with actual users beats a dozen internal assumptions. Assumptions that turn out wrong here get expensive later." },
  { title: "Make non-goals explicit", body: "Scope creep almost always starts at a boundary nobody wrote down. A short non-goals list saves re-negotiating scope mid-build." },
  { title: "Write requirements as testable statements", body: "\"Fast\" isn't a requirement. \"Loads in under 2 seconds on a mid-range Android phone\" is. If you can't write a test for it, rewrite it." },
  { title: "Circulate a draft before it feels done", body: "A PRD nobody has pushed back on usually hasn't been read carefully. Share it early enough that feedback still changes something." },
];

const BRD_ROWS = [
  { aspect: "Audience", prd: "Engineering, design, QA", brd: "Leadership, stakeholders, sponsors" },
  { aspect: "Focus", prd: "What to build and how it behaves", brd: "Why to invest, and the business case" },
  { aspect: "Detail level", prd: "Feature-level and specific", brd: "Strategic and high-level" },
  { aspect: "Typical owner", prd: "Product manager", brd: "Business analyst or project sponsor" },
  { aspect: "Written when", prd: "After the business case is approved", brd: "Before a PRD, to justify the investment" },
];

const FAQS = [
  { q: "Do I need a full PRD for every feature?", a: "No. Small, low-risk tweaks are usually fine with a short brief. Save the full template for work with real scope — multiple teams, meaningful user impact, or hard-to-reverse decisions." },
  { q: "What's the difference between a PRD and a technical spec?", a: "A PRD defines what to build and why, from the user and business side. A technical spec defines how engineering will build it — architecture, data models, edge cases." },
  { q: "Who should review a PRD before it's considered final?", a: "At minimum: the engineering lead who'll estimate it, a designer if there's UI involved, and anyone whose team's roadmap it touches." },
  { q: "How long should a PRD actually be?", a: "Long enough to align the room, short enough that people actually read it end to end. If a section doesn't change a decision, cut it." },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-sm hover:bg-paper-raised transition"
      >
        {q}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted text-lg leading-none flex-none ml-3"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden bg-paper-raised"
          >
            <p className="text-sm text-ink-soft leading-relaxed px-5 pb-4 pt-0.5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LearnSection() {
  const [tab, setTab] = useState<Tab>("What's a PRD?");

  return (
    <section className="max-w-3xl mx-auto px-5 sm:px-6 py-16 border-t border-line">
      <div className="flex justify-center mb-10">
        <div className="relative inline-flex flex-wrap justify-center gap-1 rounded-full border border-line bg-paper-raised p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative text-sm px-4 py-1.5 rounded-full transition ${tab === t ? "text-paper" : "text-muted hover:text-ink"
                }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 bg-ink rounded-full -z-0"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === "What's a PRD?" && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">What is a Product Requirements Document?</h2>
              <p className="text-ink-soft leading-relaxed mb-8">
                A PRD is the reference document that defines what a product or feature should do, who
                it's for, and how success will be measured. It's what engineering, design, and product
                align on before work starts — so decisions get made once, in writing, instead of
                re-litigated in every stand-up.
              </p>
              <div className="border border-line rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-[1fr_1.5fr] bg-paper-raised px-5 py-3 text-xs uppercase tracking-wide text-muted">
                  <span>PRD section</span>
                  <span>What it covers</span>
                </div>
                {SECTIONS.map((s) => (
                  <div
                    key={s.id}
                    className="grid grid-cols-[1fr_1.5fr] px-5 py-3.5 border-t border-line border-l-2 border-l-transparent hover:border-l-accent hover:bg-paper-raised/60 transition text-sm"
                  >
                    <span className="font-medium">{s.title}</span>
                    <span className="text-ink-soft">{s.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "How to write one" && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">How to write a PRD that actually gets used</h2>
              <p className="text-ink-soft leading-relaxed mb-8">
                The template matters less than the habits behind it. A few things separate a PRD people
                reference from one that sits unread in a doc.
              </p>
              <ol className="space-y-5">
                {HOW_TO_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex-none w-7 h-7 rounded-full bg-accent-soft text-accent text-sm font-medium flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium mb-0.5">{step.title}</p>
                      <p className="text-sm text-ink-soft leading-relaxed">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "PRD vs BRD" && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">PRD vs. BRD</h2>
              <p className="text-ink-soft leading-relaxed mb-8">
                The two get confused because both start with "requirements," but they answer different
                questions for different audiences.
              </p>
              <div className="border border-line rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-paper-raised px-5 py-3 text-xs uppercase tracking-wide text-muted">
                  <span></span>
                  <span>PRD</span>
                  <span>BRD</span>
                </div>
                {BRD_ROWS.map((row) => (
                  <div
                    key={row.aspect}
                    className="grid grid-cols-[1fr_1.2fr_1.2fr] px-5 py-3.5 border-t border-line border-l-2 border-l-transparent hover:border-l-accent hover:bg-paper-raised/60 transition text-sm"
                  >
                    <span className="font-medium">{row.aspect}</span>
                    <span className="text-ink-soft">{row.prd}</span>
                    <span className="text-ink-soft">{row.brd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "FAQ" && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Frequently asked questions</h2>
              <div className="space-y-2 mt-6">
                {FAQS.map((f) => (
                  <AccordionItem key={f.q} q={f.q} a={f.a} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
