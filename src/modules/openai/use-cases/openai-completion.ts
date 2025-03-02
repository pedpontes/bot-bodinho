import { OpenAiUseCase } from '@/domain/use-cases/open-ai/open-ai';
import { OpenAiHelper } from '@/services/openai';
import { CompletionCreateParamsNonStreaming } from 'openai/resources';

export class OpenAiCompletions
  implements OpenAiUseCase<CompletionCreateParamsNonStreaming, string>
{
  constructor(private readonly openAiHelper: OpenAiHelper) {}

  handle(data: CompletionCreateParamsNonStreaming) {
    if (!data || !data.prompt) throw new Error('❌ O prompt é obrigatório.');

    const { model = 'gpt-3.5-turbo', n = 1, temperature = 0 } = data;

    try {
      const completion = this.openAiHelper.createCompletion({
        ...data,
        model,
        n,
        temperature,
      });
      return completion;
    } catch (error: any) {
      console.error('[OPENAI]', error);
      if (error.code == 'content_policy_violation')
        throw new Error(
          '❌ Erro ao completar a solicitação. O conteúdo viola a política.',
        );
      throw new Error('❌ Erro ao completar a solicitação.');
    }
  }
}
