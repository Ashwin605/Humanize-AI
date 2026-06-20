"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { LEGAL_ASSISTANT_TOOLS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function LegalAssistant() {
  const [selectedTool, setSelectedTool] = useState("case_summary");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await api.legalAssistant(selectedTool, input);
      setResult(response.result);
    } catch {
      setResult("Unable to connect to the AI service. Please ensure the backend is running and API keys are configured.");
    } finally {
      setLoading(false);
    }
  };

  const currentTool = LEGAL_ASSISTANT_TOOLS.find((t) => t.value === selectedTool);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-3">
          <Bot className="h-7 w-7 text-gold-500" />
          Legal Research Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered tools for case analysis, statute explanation, and legal argument building.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {LEGAL_ASSISTANT_TOOLS.map((tool) => (
          <button
            key={tool.value}
            onClick={() => setSelectedTool(tool.value)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedTool === tool.value
                ? "border-gold-500 bg-gold-500/10"
                : "border-border hover:border-gold-500/30 bg-card"
            }`}
          >
            <p className="font-medium text-sm">{tool.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentTool?.label}</CardTitle>
            <CardDescription>Enter your legal text, case details, or statute for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Input</Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste case text, statute, legal concept, or argument draft..."
                className="min-h-[200px] mt-2"
              />
            </div>
            <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Result</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-sm dark:prose-invert max-w-none"
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif">
                  {result}
                </div>
              </motion.div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Results will appear here after processing.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
