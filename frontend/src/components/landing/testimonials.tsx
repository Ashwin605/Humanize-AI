"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Professor of Law, Oxford University",
    content: "LexWrite AI has transformed how my students approach legal writing. The citation preservation alone makes it indispensable for academic work.",
    rating: 5,
  },
  {
    name: "James Chen, Esq.",
    role: "Senior Associate, Baker & McKenzie",
    content: "The legal memorandum enhancement mode produces consistently polished drafts. It respects our citations and improves clarity without changing meaning.",
    rating: 5,
  },
  {
    name: "Amara Okafor",
    role: "LLM Candidate, Harvard Law School",
    content: "As an international student, the Plain English mode helps me understand complex concepts while the academic mode elevates my research papers.",
    rating: 5,
  },
  {
    name: "Prof. David Rothstein",
    role: "Legal Research Director, Yale Law",
    content: "The document analysis metrics provide actionable insights. Our research team uses LexWrite AI for every publication draft.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Trusted by Legal Professionals
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Join thousands of law students, researchers, and practitioners worldwide.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-gold-500/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
