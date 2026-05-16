import { Base64Form } from '../schemas/base64Schema';

export interface Base64Result {
  output: string;
  error?: string;
}

export function calculateBase64(params: Base64Form): Base64Result {
  if (!params.text) return { output: "" };

  try {
    if (params.mode === 'encode') {
      return { output: btoa(unescape(encodeURIComponent(params.text))) };
    } else {
      return { output: decodeURIComponent(escape(atob(params.text))) };
    }
  } catch (e) {
    return { output: "", error: "Invalid input string for this operation." };
  }
}
