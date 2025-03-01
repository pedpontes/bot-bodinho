import { IaCompletion } from '@/domain/use-cases/open-ai/ia-completions';
import { OpenAiUseCase } from '@/domain/use-cases/open-ai/open-ai';
import { CompletionCreateParamsNonStreaming } from 'openai/resources';
import { iaCompletionPrompt } from './ia-completion-prompt';

export class IaCompletionUseCase implements IaCompletion {
  constructor(
    private readonly openAiCompletions: OpenAiUseCase<
      CompletionCreateParamsNonStreaming,
      string
    >,
  ) {}

  async createCompletion(input: string): Promise<string> {
    const prompt = iaCompletionPrompt(input);
    return this.openAiCompletions.handle({
      model: 'gpt-3.5-turbo',
      prompt,
      n: 1,
      temperature: 0.2,
      max_tokens: 1000,
    });
  }
}
