export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function estimateReadingTime(text: string, wpm = 200): number {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / wpm));
}

export function extractCitations(text: string): string[] {
  const patterns = [
    /\[[\d,\s]+\]/g,
    /\(\d{4}\)\s+\d+\s+[A-Z]+(?:\s+\d+)?/g,
    /\d+\s+U\.S\.\s+\d+/g,
    /\[\d{4}\]\s+[A-Z]+(?:\s+\d+)?/g,
    /\(see\s+[^)]+\)/gi,
  ];

  const citations: string[] = [];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) citations.push(...matches);
  }
  return [...new Set(citations)];
}

export interface AnalysisScores {
  readabilityScore: number;
  grammarScore: number;
  coherenceScore: number;
  legalTerminologyDensity: number;
  sentenceVarietyScore: number;
  citationConsistencyScore: number;
  insights: string[];
}

const LEGAL_TERMS = [
  'plaintiff', 'defendant', 'jurisdiction', 'statute', 'precedent',
  'holding', 'dicta', 'remedy', 'injunction', 'liability', 'negligence',
  'contract', 'tort', 'equity', 'appellant', 'respondent', 'petitioner',
  'due process', 'constitutional', 'administrative', 'arbitration',
  'indemnity', 'estoppel', 'fiduciary', 'subpoena', 'affidavit',
];

export function analyzeDocument(text: string): AnalysisScores {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const avgSentenceLength = wordCount / sentenceCount;

  const syllableEstimate = words.reduce((acc, w) => acc + Math.max(1, w.replace(/[^aeiouAEIOU]/g, '').length), 0);
  const flesch = 206.835 - 1.015 * avgSentenceLength - 84.6 * (syllableEstimate / Math.max(wordCount, 1));
  const readabilityScore = Math.min(100, Math.max(0, Math.round(flesch)));

  const legalTermCount = words.filter((w) =>
    LEGAL_TERMS.some((t) => w.toLowerCase().includes(t))
  ).length;
  const legalTerminologyDensity = Math.min(100, Math.round((legalTermCount / Math.max(wordCount, 1)) * 1000));

  const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((acc, len) => acc + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length;
  const sentenceVarietyScore = Math.min(100, Math.round(Math.sqrt(variance) * 5));

  const citations = extractCitations(text);
  const citationConsistencyScore = citations.length > 0 ? Math.min(100, 70 + citations.length * 3) : 50;

  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 35).length;
  const grammarScore = Math.min(100, Math.max(40, 95 - longSentences * 5));

  const transitionWords = ['however', 'therefore', 'furthermore', 'moreover', 'nevertheless', 'accordingly', 'consequently'];
  const transitionCount = transitionWords.reduce(
    (acc, tw) => acc + (text.toLowerCase().match(new RegExp(`\\b${tw}\\b`, 'g'))?.length || 0),
    0
  );
  const coherenceScore = Math.min(100, Math.round(50 + transitionCount * 5 + (avgSentenceLength < 25 ? 20 : 0)));

  const insights: string[] = [];
  if (readabilityScore < 50) insights.push('Consider simplifying complex sentences for improved readability.');
  if (legalTerminologyDensity > 40) insights.push('High legal terminology density — ensure terms are defined for broader audiences.');
  if (sentenceVarietyScore < 40) insights.push('Vary sentence length to improve writing flow and engagement.');
  if (citations.length === 0) insights.push('No citations detected — verify references are properly formatted.');
  if (longSentences > 3) insights.push(`${longSentences} sentences exceed 35 words — consider breaking them up.`);

  return {
    readabilityScore,
    grammarScore,
    coherenceScore,
    legalTerminologyDensity,
    sentenceVarietyScore,
    citationConsistencyScore,
    insights: insights.length ? insights : ['Document shows strong overall writing quality.'],
  };
}
