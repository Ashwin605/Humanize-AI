export const ENHANCEMENT_MODES = {
  ACADEMIC_RESEARCH: {
    label: 'Academic Research Paper',
    tone: 'formal academic',
    formality: 'high',
    complexity: 'advanced',
    structure: 'IMRaD (Introduction, Methods, Results, Discussion)',
    vocabulary: 'scholarly legal terminology with precise definitions',
  },
  LEGAL_MEMORANDUM: {
    label: 'Legal Memorandum',
    tone: 'objective and analytical',
    formality: 'high',
    complexity: 'moderate to advanced',
    structure: 'Question Presented, Brief Answer, Facts, Discussion, Conclusion',
    vocabulary: 'formal legal prose with issue-spotting language',
  },
  CASE_BRIEF: {
    label: 'Case Brief',
    tone: 'concise and structured',
    formality: 'high',
    complexity: 'moderate',
    structure: 'Caption, Facts, Procedural History, Issue, Holding, Reasoning, Dissent',
    vocabulary: 'case law terminology and holding-focused language',
  },
  COURT_SUBMISSION: {
    label: 'Court Submission',
    tone: 'persuasive yet respectful',
    formality: 'very high',
    complexity: 'advanced',
    structure: 'Caption, Introduction, Statement of Facts, Argument, Conclusion, Prayer for Relief',
    vocabulary: 'court-appropriate formal legal language',
  },
  JOURNAL_PUBLICATION: {
    label: 'Journal Publication',
    tone: 'scholarly and authoritative',
    formality: 'very high',
    complexity: 'advanced',
    structure: 'Abstract, Introduction, Literature Review, Analysis, Conclusion, References',
    vocabulary: 'academic legal discourse with footnote-ready prose',
  },
  LAW_SCHOOL_ASSIGNMENT: {
    label: 'Law School Assignment',
    tone: 'analytical and educational',
    formality: 'high',
    complexity: 'moderate',
    structure: 'Introduction, Legal Framework, Application, Conclusion',
    vocabulary: 'IRAC/CREAC framework language',
  },
  PLAIN_ENGLISH: {
    label: 'Plain English Explanation',
    tone: 'accessible and clear',
    formality: 'moderate',
    complexity: 'simple',
    structure: 'Clear topic sentences with logical flow',
    vocabulary: 'everyday language while preserving legal accuracy',
  },
  PROFESSIONAL_LEGAL: {
    label: 'Professional Legal Writing',
    tone: 'polished and professional',
    formality: 'high',
    complexity: 'moderate to advanced',
    structure: 'Logical paragraphs with clear transitions',
    vocabulary: 'standard professional legal vocabulary',
  },
} as const;

export type EnhancementModeKey = keyof typeof ENHANCEMENT_MODES;

export const CITATION_FORMATS = ['OSCOLA', 'BLUEBOOK', 'APA', 'MLA', 'CHICAGO'] as const;

export const AI_FEATURES = [
  'smart_rewrite',
  'academic_enhancement',
  'grammar_improvement',
  'legal_style_optimization',
  'paragraph_reorganization',
  'sentence_variation',
  'clarity_enhancement',
  'redundancy_reduction',
] as const;

export const LEGAL_ASSISTANT_TOOLS = [
  'case_summary',
  'statute_explanation',
  'concept_simplifier',
  'argument_builder',
  'issue_spotter',
  'case_comparison',
] as const;
