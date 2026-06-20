export const ENHANCEMENT_MODES = [
  { value: "ACADEMIC_RESEARCH", label: "Academic Research Paper", icon: "GraduationCap" },
  { value: "LEGAL_MEMORANDUM", label: "Legal Memorandum", icon: "FileText" },
  { value: "CASE_BRIEF", label: "Case Brief", icon: "Scale" },
  { value: "COURT_SUBMISSION", label: "Court Submission", icon: "Gavel" },
  { value: "JOURNAL_PUBLICATION", label: "Journal Publication", icon: "BookOpen" },
  { value: "LAW_SCHOOL_ASSIGNMENT", label: "Law School Assignment", icon: "PenLine" },
  { value: "PLAIN_ENGLISH", label: "Plain English Explanation", icon: "MessageSquare" },
  { value: "PROFESSIONAL_LEGAL", label: "Professional Legal Writing", icon: "Briefcase" },
] as const;

export const CITATION_FORMATS = [
  { value: "OSCOLA", label: "OSCOLA", description: "Oxford Standard for Citation of Legal Authorities" },
  { value: "BLUEBOOK", label: "Bluebook", description: "The Bluebook: A Uniform System of Citation" },
  { value: "APA", label: "APA", description: "American Psychological Association" },
  { value: "MLA", label: "MLA", description: "Modern Language Association" },
  { value: "CHICAGO", label: "Chicago", description: "Chicago Manual of Style" },
] as const;

export const AI_FEATURES = [
  { value: "smart_rewrite", label: "Smart Rewrite", description: "Comprehensive intelligent rewrite" },
  { value: "academic_enhancement", label: "Academic Enhancement", description: "Elevate scholarly rigor" },
  { value: "grammar_improvement", label: "Grammar Improvement", description: "Fix grammar and syntax" },
  { value: "legal_style_optimization", label: "Legal Style Optimization", description: "Professional legal standards" },
  { value: "paragraph_reorganization", label: "Paragraph Reorganization", description: "Improve logical flow" },
  { value: "sentence_variation", label: "Sentence Variation", description: "Vary structure and length" },
  { value: "clarity_enhancement", label: "Clarity Enhancement", description: "Maximize readability" },
  { value: "redundancy_reduction", label: "Redundancy Reduction", description: "Remove repetitive phrasing" },
] as const;

export const LEGAL_ASSISTANT_TOOLS = [
  { value: "case_summary", label: "Case Summary Generator", description: "Structured case summaries" },
  { value: "statute_explanation", label: "Statute Explanation", description: "Clear statute breakdowns" },
  { value: "concept_simplifier", label: "Legal Concept Simplifier", description: "Plain English explanations" },
  { value: "argument_builder", label: "Argument Builder", description: "Structured legal arguments" },
  { value: "issue_spotter", label: "Issue Spotter", description: "Identify legal issues" },
  { value: "case_comparison", label: "Case Comparison", description: "Compare cases and principles" },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with legal writing enhancement",
    features: [
      "10 documents per month",
      "50,000 words processed",
      "Basic enhancement modes",
      "OSCOLA & Bluebook support",
      "Document analysis",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "For serious law students and legal researchers",
    features: [
      "Unlimited documents",
      "500,000 words per month",
      "All enhancement modes",
      "All citation formats",
      "Legal research assistant",
      "Priority AI processing",
      "Export to PDF & DOCX",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 99,
    period: "month",
    description: "For law firms, universities, and institutions",
    features: [
      "Everything in Pro",
      "Unlimited word processing",
      "Team collaboration",
      "Custom prompt templates",
      "API access",
      "Dedicated support",
      "Audit logging",
      "SSO integration",
    ],
    cta: "Contact Sales",
    popular: false,
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Does LexWrite AI bypass AI detectors?",
    answer: "No. LexWrite AI is designed to improve the quality, clarity, and professionalism of legal writing. We do not claim to bypass AI detectors or guarantee detector evasion. Our focus is on enhancing legitimate legal content.",
  },
  {
    question: "Are my citations preserved during enhancement?",
    answer: "Yes. LexWrite AI is specifically designed to preserve all citations, references, footnotes, and legal references exactly as written. We never alter legal references or fabricate sources.",
  },
  {
    question: "What citation formats are supported?",
    answer: "We support OSCOLA, Bluebook, APA, MLA, and Chicago citation formats. Citations are detected and preserved regardless of format.",
  },
  {
    question: "Can I import existing documents?",
    answer: "Yes. You can import PDF, DOCX, TXT, and RTF files via drag-and-drop upload. Text is automatically extracted for editing and enhancement.",
  },
  {
    question: "Which AI models power LexWrite AI?",
    answer: "LexWrite AI integrates with OpenAI, Anthropic, and Google Gemini APIs. You can configure your preferred provider in settings.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use enterprise-grade security including JWT authentication, encrypted storage via AWS S3, audit logging, and comply with data protection standards.",
  },
] as const;

export const SAMPLE_LEGAL_TEXT = `IN THE MATTER OF CONTRACTUAL OBLIGATIONS

The plaintiff alleges that the defendant breached the terms of the agreement entered into on 15 March 2023. Pursuant to Section 2(a) of the contract, the defendant was obligated to deliver the goods within thirty (30) days of receipt of payment.

It is submitted that the defendant's failure to perform constitutes a material breach of contract. In accordance with the principles established in Hadley v Baxendale (1854) 9 Exch 341, the plaintiff is entitled to recover damages flowing naturally from the breach.

Furthermore, the defendant's conduct demonstrates a wilful disregard for the contractual obligations. The court should therefore grant the relief sought, namely: (i) damages in the sum of £45,000; (ii) interest pursuant to Section 35A of the Senior Courts Act 1981; and (iii) costs on the standard basis.`;
