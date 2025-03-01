import { Controller } from '@/domain/interfaces/controller';
import { IaCompletion } from '@/domain/use-cases/open-ai/ia-completions';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export class IaCompletionController implements Controller {
  constructor(private readonly iaCompletionUseCase: IaCompletion) {}

  async handle(interation: ChatInputCommandInteraction<CacheType>) {
    const input = interation.options.getString('input') as string;

    if (!input) {
      await interation.reply('❌ Você precisa informar uma pergunta!');
      return;
    }

    await interation.reply('🤖 Em desenvolvimento...');

    const completion = await this.iaCompletionUseCase.createCompletion(input);

    if (completion) {
      await interation.editReply(
        '`Pergunta`:\n' + input + '\n\n`IA`:\n' + completion,
      );
    } else {
      await interation.editReply('❌ A resposta da IA está vazia.');
    }
  }
}
