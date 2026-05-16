import { z } from 'zod';
import { CalculatorFactory } from '../../../core/calculator-factory';

const WordCountSchema = z.object({
  text: z.string().optional(),
});

type FormValues = z.infer<typeof WordCountSchema>;

interface WordCountResult {
  words: number;
  chars: number;
  noSpace: number;
  sentences: number;
  paragraphs: number;
  readTime: number;
  speakTime: number;
}

function calculateWordCount(data: FormValues): WordCountResult {
  const text = data.text || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const noSpace = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const readTime = Math.max(1, Math.ceil(words / 200));
  const speakTime = Math.max(1, Math.ceil(words / 130));
  
  return { words, chars, noSpace, sentences, paragraphs, readTime, speakTime };
}

export const WordCountCalculator = CalculatorFactory.createSimple<FormValues, WordCountResult>({
  id: 'word-counter',
  domain: 'everyday',
  title: 'Word Counter & Analyzer',
  schema: WordCountSchema,
  defaultValues: { text: '' },
  engine: calculateWordCount,
  fields: [
    { 
      name: 'text', 
      label: 'Your Text', 
      type: 'text',
      isTextArea: true,
      placeholder: 'Paste or type your text here...' 
    }
  ],
  resultLabel: 'Word Count',
  resultFormatter: (res) => res.words.toLocaleString(),
  stats: (res) => [
    { label: 'Characters', value: res.chars.toLocaleString() },
    { label: 'Sentences', value: res.sentences.toString() },
    { label: 'Paragraphs', value: res.paragraphs.toString() },
    { label: 'Char (No Space)', value: res.noSpace.toLocaleString() },
  ],
  insights: (res) => {
    if (res.words === 0) return [];
    return [{ type: 'info' as const, message: `${res.words} words · ${res.readTime} min read · ${res.speakTime} min to speak` }];
  }
});
