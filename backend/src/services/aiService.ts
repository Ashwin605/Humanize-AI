import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENHANCEMENT_MODES, EnhancementModeKey } from '../utils/constants.js';
import { extractCitations } from '../utils/textAnalysis.js';

type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'groq';

const SYSTEM_BASE = `You are LexWrite AI, a professional legal writing enhancement assistant for law students, researchers, and legal professionals.

CRITICAL RULES:
- Preserve ALL citations, references, footnotes, and legal citations EXACTLY as written
- NEVER fabricate sources, cases, statutes, or legal references
- NEVER alter legal references, case names, or citation numbers
- Maintain factual accuracy — do not change legal meaning or conclusions
- Improve clarity, readability, structure, and professional tone
- Reduce repetitive phrasing and improve sentence variety
- You do NOT bypass AI detectors and must never claim to do so

When enhancing text, return ONLY the enhanced text without explanations or markdown wrappers.`;

function buildEnhancementPrompt(
  text: string,
  mode: EnhancementModeKey,
  citationFormat: string,
  feature?: string
): { system: string; user: string } {
  const modeConfig = ENHANCEMENT_MODES[mode];
  const citations = extractCitations(text);

  let featureInstruction = '';
  if (feature) {
    const featureMap: Record<string, string> = {
      smart_rewrite: 'Perform a comprehensive smart rewrite while preserving meaning.',
      academic_enhancement: 'Enhance academic rigor and scholarly tone.',
      grammar_improvement: 'Focus primarily on grammar, punctuation, and syntax.',
      legal_style_optimization: 'Optimize for professional legal writing standards.',
      paragraph_reorganization: 'Reorganize paragraphs for better logical flow.',
      sentence_variation: 'Vary sentence structure and length for better readability.',
      clarity_enhancement: 'Maximize clarity and plain understanding.',
      redundancy_reduction: 'Remove redundant phrases and repetitive language.',
    };
    featureInstruction = featureMap[feature] || '';
  }

  const system = `${SYSTEM_BASE}

Writing Mode: ${modeConfig.label}
Tone: ${modeConfig.tone}
Formality: ${modeConfig.formality}
Sentence Complexity: ${modeConfig.complexity}
Structure: ${modeConfig.structure}
Vocabulary: ${modeConfig.vocabulary}
Citation Format: ${citationFormat}
${citations.length ? `\nDetected citations to preserve: ${citations.join(', ')}` : ''}`;

  const user = `${featureInstruction ? featureInstruction + '\n\n' : ''}Enhance the following legal text:\n\n${text}`;

  return { system, user };
}

async function callOpenAI(system: string, user: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.4,
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content || '';
}

async function callAnthropic(system: string, user: string): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: user }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

async function callGemini(system: string, user: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: system,
  });
  const response = await model.generateContent(user);
  return response.response.text();
}

async function callGroq(system: string, user: string): Promise<string> {
  const client = new OpenAI({ 
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    temperature: 0.4,
    max_tokens: 4096,
  });
  return response.choices[0]?.message?.content || '';
}

function mockEnhancement(text: string, mode: EnhancementModeKey): string {
  const modeLabel = ENHANCEMENT_MODES[mode].label;
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  
  const enhanced = paragraphs.map((p, i) => {
    let trimmed = p.trim();
    
    // Make noticeable changes to demonstrate it's "working" locally
    trimmed = trimmed
      .replace(/\b(in order to)\b/gi, 'to')
      .replace(/\b(due to the fact that)\b/gi, 'because')
      .replace(/\b(at this point in time)\b/gi, 'currently')
      .replace(/\b(in the event that)\b/gi, 'if')
      .replace(/\b(alleges)\b/gi, 'contends')
      .replace(/\b(breached)\b/gi, 'violated')
      .replace(/\b(entered into)\b/gi, 'executed')
      .replace(/\b(Pursuant to)\b/gi, 'In accordance with')
      .replace(/\b(obligated)\b/gi, 'required')
      .replace(/\b(failure to perform)\b/gi, 'non-performance')
      .replace(/\b(demonstrates)\b/gi, 'evidences')
      .replace(/\b(grant the relief sought)\b/gi, 'award the requested remedies');

    // Add a disclaimer to the first paragraph
    if (i === 0) {
      return `[${modeLabel} — Local Fallback Mode]\n*Note: AI provider API key is missing or over quota. Showing simulated enhancement.*\n\n${trimmed}`;
    }
    return trimmed;
  });
  
  return enhanced.join('\n\n');
}

export async function enhanceText(
  text: string,
  mode: EnhancementModeKey,
  citationFormat: string,
  feature?: string,
  provider?: AIProvider
): Promise<{ enhancedText: string; tokensUsed: number; provider: string }> {
  const selectedProvider = provider || (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
  const { system, user } = buildEnhancementPrompt(text, mode, citationFormat, feature);

  const hasKey =
    (selectedProvider === 'openai' && process.env.OPENAI_API_KEY) ||
    (selectedProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) ||
    (selectedProvider === 'gemini' && process.env.GEMINI_API_KEY) ||
    (selectedProvider === 'groq' && process.env.GROQ_API_KEY);

  if (!hasKey) {
    return {
      enhancedText: mockEnhancement(text, mode),
      tokensUsed: Math.ceil(text.length / 4),
      provider: 'mock',
    };
  }

  let enhancedText = '';
  try {
    switch (selectedProvider) {
      case 'anthropic':
        enhancedText = await callAnthropic(system, user);
        break;
      case 'gemini':
        enhancedText = await callGemini(system, user);
        break;
      case 'groq':
        enhancedText = await callGroq(system, user);
        break;
      default:
        enhancedText = await callOpenAI(system, user);
    }
  } catch (error: any) {
    console.error(`AI provider ${selectedProvider} failed:`, error);
    
    // Provide a user-friendly error for invalid keys or rate limits
    const errMsg = error?.message || '';
    if (error?.status === 401 || error?.status === 403 || errMsg.includes('401') || errMsg.includes('403') || errMsg.includes('invalid authentication credentials')) {
      throw new Error(`AI provider API key is invalid or unauthorized. Please check your ${selectedProvider} API key.`);
    }
    if (error?.status === 429 || errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('Too Many Requests')) {
      throw new Error(`AI provider rate limit exceeded. Please check your API key quota (Provider: ${selectedProvider}).`);
    }
    
    throw new Error(`AI enhancement failed: ${errMsg || 'Unknown error'}`);
  }

  return {
    enhancedText: enhancedText.trim(),
    tokensUsed: Math.ceil((text.length + enhancedText.length) / 4),
    provider: selectedProvider,
  };
}

export async function legalAssistant(
  tool: string,
  input: string,
  provider?: AIProvider
): Promise<{ result: string; tokensUsed: number }> {
  const toolPrompts: Record<string, string> = {
    case_summary: 'Generate a structured case summary with Facts, Procedural History, Issue, Holding, and Reasoning.',
    statute_explanation: 'Explain this statute in clear, structured legal language suitable for practitioners.',
    concept_simplifier: 'Simplify this legal concept while maintaining accuracy. Use plain English.',
    argument_builder: 'Build a structured legal argument with premises, authorities, and conclusion.',
    issue_spotter: 'Identify and list all legal issues present in this text with brief explanations.',
    case_comparison: 'Compare the cases or legal principles described, highlighting similarities and differences.',
  };

  const instruction = toolPrompts[tool] || 'Analyze the following legal content.';
  const selectedProvider = provider || (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';

  const hasKey =
    (selectedProvider === 'openai' && process.env.OPENAI_API_KEY) ||
    (selectedProvider === 'anthropic' && process.env.ANTHROPIC_API_KEY) ||
    (selectedProvider === 'gemini' && process.env.GEMINI_API_KEY) ||
    (selectedProvider === 'groq' && process.env.GROQ_API_KEY);

  if (!hasKey) {
    return {
      result: `[${tool.replace(/_/g, ' ').toUpperCase()}]\n\nAnalysis of provided content:\n\n${input.slice(0, 500)}...\n\nNote: Connect an AI API key for full analysis capabilities.`,
      tokensUsed: Math.ceil(input.length / 4),
    };
  }

  const system = `${SYSTEM_BASE}\n\nTask: ${instruction}\nNever fabricate cases or statutes.`;
  const user = input;

  let result = '';
  switch (selectedProvider) {
    case 'anthropic':
      result = await callAnthropic(system, user);
      break;
    case 'gemini':
      result = await callGemini(system, user);
      break;
    case 'groq':
      result = await callGroq(system, user);
      break;
    default:
      result = await callOpenAI(system, user);
  }

  return { result: result.trim(), tokensUsed: Math.ceil((input.length + result.length) / 4) };
}
