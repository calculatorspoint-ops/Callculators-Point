import { CalculatorFactory } from '../../../core/calculator-factory';
import { Base64Schema } from './schemas/base64Schema';
import { calculateBase64 } from './engine/base64Engine';

export const Base64Encoder = CalculatorFactory.createSimple({
  id: 'base64-encoder',
  domain: 'conversion',
  title: 'Base64 Encoder / Decoder',
  schema: Base64Schema,
  defaultValues: { mode: 'encode', text: '' },
  engine: calculateBase64,
  fields: [
    {
      name: 'mode',
      label: 'Operation',
      type: 'select',
      options: [
        { label: 'Encode to Base64', value: 'encode' },
        { label: 'Decode from Base64', value: 'decode' }
      ]
    },
    {
      name: 'text',
      label: 'Input Text',
      type: 'text',
      isTextArea: true,
      placeholder: 'Enter string here...'
    }
  ],
  resultLabel: 'Output',
  resultFormatter: (result: any) => {
    if (result.error) return `Error: ${result.error}`;
    return result.output;
  }
});
