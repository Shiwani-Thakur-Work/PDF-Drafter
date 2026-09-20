"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 opacity-60"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, var(--accent-soft) 0%, transparent 70%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative max-w-3xl mx-auto px-5 sm:px-6 pt-16 pb-10 text-center"
      >
        <span className="inline-block text-[11px] font-medium tracking-wide text-accent bg-accent-soft rounded-full px-3 py-1 mb-5">
          Free & open source
        </span>
        <h1 className="text-[32px] sm:text-[40px] font-semibold leading-[1.15] mb-4">
          Turn a rough idea into a real PRD
        </h1>
        <p className="text-ink-soft text-[15px] max-w-lg mx-auto leading-relaxed">
          Describe what you're building, answer a few clarifying questions, and get a
          structured, editable product requirements document — ready to download or paste
          straight into your workspace.
        </p>
      </motion.div>
    </section>
  );
}
