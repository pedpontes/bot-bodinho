import { IaCompletionController } from '@/modules/openai/controller/ia-completion';
import { IaCompletionUseCase } from '@/modules/openai/use-cases/create-completion.ts/ia-completion/ia-completion';
import { OpenAiCompletions } from '@/modules/openai/use-cases/openai-completion';
import { OpenAiHelper } from '@/services/openai';

export const makeIaCompletion = (): IaCompletionController => {
  return new IaCompletionController(
    new IaCompletionUseCase(new OpenAiCompletions(new OpenAiHelper())),
  );
};
