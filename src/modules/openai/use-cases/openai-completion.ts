import { OpenAiUseCase } from '@/domain/use-cases/open-ai/open-ai';
import { OpenAiHelper } from '@/services/openai';
import { CompletionCreateParamsNonStreaming } from 'openai/resources';

export class OpenAiCompletions
  implements OpenAiUseCase<CompletionCreateParamsNonStreaming, string>
{
  constructor(private readonly openAiHelper: OpenAiHelper) {}

  handle(data: CompletionCreateParamsNonStreaming) {
    if (!data || !data.prompt)
      throw new Error('[OPENAI] ❌ O prompt é obrigatório.');

    const { model = 'gpt-3.5-turbo', n = 1, temperature = 0 } = data;

    try {
      const completion = this.openAiHelper.createCompletion({
        ...data,
        model,
        n,
        temperature,
      });
      return completion;
    } catch {
      throw new Error('[OPENAI] ❌ Erro ao completar a solicitação.');
    }
  }
}
