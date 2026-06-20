"use client";

import { motion } from "framer-motion";
import {
  Scale, BookOpen, BarChart3, Shield, Sparkles,
  PenLine, Languages, Upload, Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: PenLine,
    title: "Dual-Pane Editor",
    description: "Compare original and enhanced text side-by-side with live diff highlighting and synchronization.",
  },
  {
    icon: Scale,
    title: "8 Enhancement Modes",
    description: "Academic papers, legal memoranda, case briefs, court submissions, and more tailored writing styles.",
  },
  {
    icon: Shield,
    title: "Citation Preservation",
    description: "OSCOLA, Bluebook, APA, MLA, and Chicago citations are detected and preserved exactly.",
  },
  {
    icon: BarChart3,
    title: "Writing Analytics",
    description: "Readability, grammar, coherence, legal terminology density, and citation consistency scores.",
  },
  {
    icon: Sparkles,
    title: "Legal Research Assistant",
    description: "Case summaries, statute explanations, argument builders, issue spotters, and case comparisons.",
  },
  {
    icon: Languages,
    title: "Plain English Mode",
    description: "Transform complex legal prose into accessible language while maintaining accuracy.",
  },
  {
    icon: Upload,
    title: "Document Import",
    description: "Import PDF, DOCX, TXT, and RTF files with automatic text extraction and section editing.",
  },
  {
    icon: Download,
    title: "Multi-Format Export",
    description: "Export to PDF, DOCX, TXT, Markdown, or formatted research paper templates.",
  },
  {
    icon: BookOpen,
    title: "Template Library",
    description: "Save and reuse document templates for consistent legal writing across projects.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="section-padding bg-secondary/30">
      <div className="container-max mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Everything You Need for{" "}
            <span className="gradient-text">Excellence in Legal Writing</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Comprehensive tools designed specifically for the legal academic and professional community.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="h-full hover:border-gold-500/30 group">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800/5 dark:bg-gold-500/10 group-hover:bg-gold-500/20 transition-colors">
                    <feature.icon className="h-5 w-5 text-navy-700 dark:text-gold-400" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
