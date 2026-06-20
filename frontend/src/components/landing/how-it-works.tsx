"use client";

import { motion } from "framer-motion";
import { Upload, Wand2, BarChart3, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Import or Write",
    description: "Upload PDF, DOCX, TXT, or RTF files — or start writing directly in the dual-pane editor.",
  },
  {
    step: "02",
    icon: Wand2,
    title: "Choose Enhancement Mode",
    description: "Select from 8 legal writing modes tailored to memoranda, briefs, academic papers, and more.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Analyze & Refine",
    description: "Review writing quality metrics, diff highlighting, and AI-generated insights for improvement.",
  },
  {
    step: "04",
    icon: Download,
    title: "Export & Publish",
    description: "Export publication-ready documents in PDF, DOCX, Markdown, or formatted research paper style.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            How LexWrite AI Works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From draft to publication-ready legal document in four simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-gold-500/50 to-transparent" />
              )}
              <div className="text-center">
                <div className="relative inline-flex">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl glass border-gold-500/20">
                    <step.icon className="h-8 w-8 text-gold-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 dark:bg-gold-500 text-xs font-bold text-white dark:text-navy-950">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
