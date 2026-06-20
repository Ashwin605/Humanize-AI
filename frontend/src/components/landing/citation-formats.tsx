"use client";

import { motion } from "framer-motion";
import { CITATION_FORMATS } from "@/lib/constants";

export function CitationFormats() {
  return (
    <section className="section-padding">
      <div className="container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Supported Citation Formats
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            All citations and legal references are preserved exactly — never altered or fabricated.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CITATION_FORMATS.map((format, i) => (
            <motion.div
              key={format.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card text-center hover:border-gold-500/30 transition-colors"
            >
              <div className="text-2xl font-display font-bold text-gold-500 mb-2">
                {format.label}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {format.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
