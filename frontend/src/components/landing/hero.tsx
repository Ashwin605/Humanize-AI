"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentAnimation } from "./document-animation";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-navy-600/10 rounded-full blur-3xl" />

      <div className="container-max mx-auto section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/5 text-sm text-gold-600 dark:text-gold-400 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Professional Legal Writing Enhancement
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
              Elevate Your{" "}
              <span className="gradient-text">Legal Writing</span>{" "}
              to Publication Quality
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
              LexWrite AI helps law students, researchers, and legal professionals
              enhance clarity, structure, and academic quality while preserving
              citations and factual accuracy.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="group">
                  Start Writing Better
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">See How It Works</Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { icon: Shield, text: "Citation Preservation" },
                { icon: BookOpen, text: "8 Writing Modes" },
                { icon: Sparkles, text: "AI-Powered Analysis" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-gold-500" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <DocumentAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
