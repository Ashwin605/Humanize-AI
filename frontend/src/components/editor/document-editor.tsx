"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wand2, BarChart3, Download, Upload, Clock, Type,
  AlignLeft, Sparkles, Loader2, Save,
} from "lucide-react";
import { api, DocumentAnalysis } from "@/lib/api";
import { ENHANCEMENT_MODES, CITATION_FORMATS, AI_FEATURES, SAMPLE_LEGAL_TEXT } from "@/lib/constants";
import { countWords, countCharacters, estimateReadingTime, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea, Label } from "@/components/ui/input";
import { ScoreRing } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";

interface DocumentEditorProps {
  documentId?: string;
  initialTitle?: string;
  initialText?: string;
}

export function DocumentEditor({ documentId, initialTitle, initialText }: DocumentEditorProps) {
  const [title, setTitle] = useState(initialTitle || "Untitled Document");
  const [originalText, setOriginalText] = useState(initialText || SAMPLE_LEGAL_TEXT);
  const [enhancedText, setEnhancedText] = useState("");
  const [enhancementMode, setEnhancementMode] = useState("PROFESSIONAL_LEGAL");
  const [citationFormat, setCitationFormat] = useState("OSCOLA");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [docId, setDocId] = useState(documentId);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [syncScroll, setSyncScroll] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (documentId) {
      api.getDocument(documentId).then((doc) => {
        setTitle(doc.title);
        setOriginalText(doc.originalText);
        setEnhancedText(doc.enhancedText || "");
        setEnhancementMode(doc.enhancementMode);
        setCitationFormat(doc.citationFormat);
        if (doc.analysis) setAnalysis(doc.analysis);
      }).catch(console.error);
    }
  }, [documentId]);

  const stats = useMemo(() => ({
    original: {
      words: countWords(originalText),
      chars: countCharacters(originalText),
      readingTime: estimateReadingTime(originalText),
    },
    enhanced: {
      words: countWords(enhancedText),
      chars: countCharacters(enhancedText),
      readingTime: estimateReadingTime(enhancedText),
    },
  }), [originalText, enhancedText]);

  const handleEnhance = async () => {
    setErrorMessage(null);
    if (!user) {
      setErrorMessage("Please sign in to use AI enhancement. Your text will be enhanced using our AI models.");
      // Still do a basic local enhancement as a preview
      setEnhancedText(generateLocalEnhancement(originalText));
      return;
    }
    setLoading(true);
    try {
      let id = docId;
      if (!id) {
        const doc = await api.createDocument({
          title,
          originalText,
          enhancementMode,
          citationFormat,
        });
        id = doc.id;
        setDocId(id);
      } else {
        await api.updateDocument(id, { title, originalText, enhancementMode, citationFormat });
      }

      const result = await api.enhanceDocument(id, {
        feature: selectedFeature || undefined,
        text: originalText,
      });
      setEnhancedText(result.enhancedText);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Enhancement failed";
      if (message === "Unauthorized" || message === "Invalid token") {
        setErrorMessage("Your session has expired. Please sign in again.");
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setErrorMessage(null);
    if (!user) {
      setErrorMessage("Please sign in to use document analysis.");
      setAnalysis(generateLocalAnalysis(enhancedText || originalText));
      setShowAnalysis(true);
      return;
    }
    setLoading(true);
    try {
      let id = docId;
      if (!id) {
        const doc = await api.createDocument({ title, originalText });
        id = doc.id;
        setDocId(id);
      }
      const result = await api.analyzeDocument(id, enhancedText || originalText);
      setAnalysis(result);
      setShowAnalysis(true);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Analysis failed";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);
    if (!user) {
      setErrorMessage("Please sign in to save documents.");
      return;
    }
    setSaving(true);
    try {
      if (docId) {
        await api.updateDocument(docId, { title, originalText, enhancedText });
      } else {
        const doc = await api.createDocument({ title, originalText, enhancedText, enhancementMode, citationFormat });
        setDocId(doc.id);
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Save failed";
      setErrorMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const doc = await api.importDocument(file, title);
      setDocId(doc.id);
      setOriginalText(doc.originalText);
      setTitle(doc.title);
    } catch {
      const text = await file.text();
      setOriginalText(text);
    }
  };

  const handleExport = async (format: string) => {
    if (!docId) return;
    const response = await api.exportDocument(docId, format);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.${format === "md" ? "md" : "txt"}`;
    a.click();
  };

  const handleScroll = (source: "original" | "enhanced") => (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (!syncScroll) return;
    const target = e.currentTarget;
    const other = document.getElementById(source === "original" ? "enhanced-pane" : "original-pane");
    if (other) {
      const ratio = target.scrollTop / (target.scrollHeight - target.clientHeight);
      other.scrollTop = ratio * (other.scrollHeight - other.clientHeight);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-border bg-card/50 backdrop-blur-xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-display text-lg font-semibold bg-transparent border-none outline-none flex-1 min-w-[200px]"
        />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={enhancementMode}
            onChange={(e) => setEnhancementMode(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
          >
            {ENHANCEMENT_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={citationFormat}
            onChange={(e) => setCitationFormat(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
          >
            {CITATION_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
          <label>
            <input type="file" accept=".pdf,.docx,.txt,.rtf" className="hidden" onChange={handleImport} />
            <Button variant="outline" size="sm" asChild>
              <span><Upload className="h-4 w-4" /> Import</span>
            </Button>
          </label>
          <Button size="sm" onClick={handleEnhance} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            Enhance
          </Button>
          <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={loading}>
            <BarChart3 className="h-4 w-4" /> Analyze
          </Button>
          {docId && (
            <Button variant="ghost" size="sm" onClick={() => handleExport("txt")}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Error / Auth Banner */}
      {errorMessage && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-amber-500/30 bg-amber-500/10">
          <p className="text-sm text-amber-700 dark:text-amber-300">{errorMessage}</p>
          <div className="flex items-center gap-2 shrink-0">
            {!user && (
              <Link href="/login">
                <Button size="sm" variant="outline" className="text-xs">
                  Sign In
                </Button>
              </Link>
            )}
            <button onClick={() => setErrorMessage(null)} className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 text-xs font-medium">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* AI Features Bar */}
      <div className="flex gap-2 p-3 border-b border-border overflow-x-auto bg-secondary/30">
        {AI_FEATURES.map((f) => (
          <button
            key={f.value}
            onClick={() => setSelectedFeature(selectedFeature === f.value ? null : f.value)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              selectedFeature === f.value
                ? "bg-gold-500 text-navy-950"
                : "bg-background border border-border hover:border-gold-500/50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Dual Pane Editor */}
      <div className="flex-1 grid md:grid-cols-2 divide-x divide-border min-h-0">
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/20">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Original Text</Label>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Type className="h-3 w-3" />{stats.original.words} words</span>
              <span className="flex items-center gap-1"><AlignLeft className="h-3 w-3" />{stats.original.chars} chars</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{stats.original.readingTime} min</span>
            </div>
          </div>
          <Textarea
            id="original-pane"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            onScroll={handleScroll("original")}
            className="flex-1 rounded-none border-0 resize-none font-serif text-sm leading-relaxed min-h-[300px] focus-visible:ring-0"
          />
        </div>

        <div className="flex flex-col min-h-0 bg-gold-500/5">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gold-500/5">
            <Label className="text-xs uppercase tracking-wider text-gold-600 dark:text-gold-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Enhanced Text
            </Label>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{stats.enhanced.words} words</span>
              <span>{stats.enhanced.readingTime} min read</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={syncScroll} onChange={(e) => setSyncScroll(e.target.checked)} className="rounded" />
                Sync
              </label>
            </div>
          </div>
          <Textarea
            id="enhanced-pane"
            value={enhancedText}
            onChange={(e) => setEnhancedText(e.target.value)}
            onScroll={handleScroll("enhanced")}
            placeholder="Enhanced text will appear here..."
            className="flex-1 rounded-none border-0 resize-none font-serif text-sm leading-relaxed min-h-[300px] focus-visible:ring-0 bg-transparent"
          />
        </div>
      </div>

      {/* Analysis Panel */}
      {showAnalysis && analysis && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-border bg-card p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Document Analysis</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowAnalysis(false)}>Close</Button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-4">
            <ScoreRing score={Math.round(analysis.readabilityScore)} label="Readability" size={70} />
            <ScoreRing score={Math.round(analysis.grammarScore)} label="Grammar" size={70} />
            <ScoreRing score={Math.round(analysis.coherenceScore)} label="Coherence" size={70} />
            <ScoreRing score={Math.round(analysis.legalTerminologyDensity)} label="Legal Terms" size={70} />
            <ScoreRing score={Math.round(analysis.sentenceVarietyScore)} label="Variety" size={70} />
            <ScoreRing score={Math.round(analysis.citationConsistencyScore)} label="Citations" size={70} />
          </div>
          {analysis.insights && (
            <div className="space-y--2">
              {(analysis.insights as string[]).map((insight, i) => (
                <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold-500 mt-0.5 shrink-0" />
                  {insight}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function generateLocalEnhancement(text: string): string {
  return text
    .replace(/\b(in order to)\b/gi, "to")
    .replace(/\b(due to the fact that)\b/gi, "because")
    .replace(/\b(at this point in time)\b/gi, "currently")
    .replace(/\b(in the event that)\b/gi, "if")
    .replace(/\b(pursuant to)\b/gi, "under")
    .replace(/\b(notwithstanding the foregoing)\b/gi, "however");
}

function generateLocalAnalysis(text: string): DocumentAnalysis {
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  return {
    readabilityScore: Math.min(95, 50 + sentences * 3),
    grammarScore: Math.min(95, 70 + Math.floor(words / 50)),
    coherenceScore: Math.min(90, 60 + sentences * 2),
    legalTerminologyDensity: Math.min(80, 30 + Math.floor(words / 30)),
    sentenceVarietyScore: Math.min(85, 45 + sentences * 4),
    citationConsistencyScore: text.includes("[") || text.includes("v ") ? 85 : 50,
    insights: ["Connect an API key for full AI-powered analysis.", "Document structure appears adequate for legal writing."],
  };
}
