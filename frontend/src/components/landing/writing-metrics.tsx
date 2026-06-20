"use client";

import { motion } from "framer-motion";
import { ScoreRing, ProgressBar } from "@/components/ui/progress";

const metrics = [
  { label: "Readability", score: 87, description: "Flesch-based readability analysis" },
  { label: "Grammar", score: 92, description: "Syntax and structure quality" },
  { label: "Coherence", score: 85, description: "Logical flow and transitions" },
  { label: "Legal Terms", score: 78, description: "Terminology density analysis" },
  { label: "Sentence Variety", score: 81, description: "Structural diversity score" },
  { label: "Citations", score: 95, description: "Citation consistency check" },
];

export function WritingMetrics() {
  return (
    <section className="section-padding bg-navy-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="container-max mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Writing Quality <span className="text-gold-400">Metrics</span>
          </h2>
          <p className="mt-4 text-navy-200 text-lg">
            Comprehensive document analysis with interactive insights to elevate your legal writing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 gap-6"
          >
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ScoreRing score={metric.score} label={metric.label} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 border-white/10"
          >
            <h3 className="font-display text-xl font-semibold mb-6">Detailed Analysis</h3>
            <div className="space-y-5">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{metric.label}</span>
                    <span className="text-gold-400 font-medium">{metric.score}%</span>
                  </div>
                  <ProgressBar value={metric.score} />
                  <p className="text-xs text-navy-300 mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
