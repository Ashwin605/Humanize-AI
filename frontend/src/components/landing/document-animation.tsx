"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const originalLines = [
  "The plaintiff alleges breach of contract.",
  "The defendant failed to deliver goods.",
  "Damages are sought pursuant to statute.",
];

const enhancedLines = [
  "The plaintiff submits that the defendant materially breached the contractual obligations.",
  "Specifically, the defendant failed to deliver the goods within the prescribed timeframe.",
  "Accordingly, the plaintiff seeks damages as provided under the applicable statute.",
];

export function DocumentAnimation() {
  const [phase, setPhase] = useState<"original" | "processing" | "enhanced">("original");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => {
        if (prev === "original") return "processing";
        if (prev === "processing") return "enhanced";
        setLineIndex(0);
        return "original";
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase === "enhanced") {
      const interval = setInterval(() => {
        setLineIndex((i) => (i < enhancedLines.length - 1 ? i + 1 : i));
      }, 800);
      return () => clearInterval(interval);
    }
    setLineIndex(0);
  }, [phase]);

  const lines = phase === "enhanced" ? enhancedLines : originalLines;

  return (
    <div className="relative">
      <div className="glass-card p-0 overflow-hidden shadow-glass-lg">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-navy-950/5 dark:bg-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-gold-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <span className="text-xs text-muted-foreground ml-2 font-mono">
            contract_breach_memo.docx
          </span>
          <div className="ml-auto">
            <AnimatePresence mode="wait">
              {phase === "processing" && (
                <motion.span
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-gold-500 flex items-center gap-1"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-3 h-3 border-2 border-gold-500 border-t-transparent rounded-full"
                  />
                  Enhancing...
                </motion.span>
              )}
              {phase === "enhanced" && (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-green-500"
                >
                  Enhanced
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border min-h-[280px]">
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">
              Original
            </p>
            <div className="space-y-3">
              {originalLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gold-500/5">
            <p className="text-[10px] uppercase tracking-wider text-gold-600 dark:text-gold-400 mb-3 font-medium">
              Enhanced
            </p>
            <div className="space-y-3">
              {lines.map((line, i) => (
                <motion.p
                  key={`${phase}-${i}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{
                    opacity: phase === "enhanced" ? (i <= lineIndex ? 1 : 0.2) : phase === "processing" ? 0.3 : 0.2,
                    x: 0,
                  }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-sm leading-relaxed ${
                    phase === "enhanced" && i <= lineIndex
                      ? "text-foreground"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {phase === "enhanced" && i <= lineIndex ? enhancedLines[i] : line}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>OSCOLA · Legal Memorandum</span>
          <span>Citations preserved</span>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-4 -right-4 glass-card px-4 py-2 text-xs shadow-gold"
      >
        <span className="text-gold-500 font-semibold">+42%</span> readability
      </motion.div>
    </div>
  );
}
