export function iaCompletionPrompt(input: string): [string, string] {
  return [systemPrompt, input];
}

const systemPrompt =
  'Você é um assistente do google e deve responder a todas as perguntas o mais objetivo e claro possivel.';
