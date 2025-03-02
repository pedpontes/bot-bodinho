import { Controller } from '@/domain/interfaces/controller';
import { CreatorImage } from '@/domain/use-cases/open-ai/creator-image';
import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';

export class CreatorImageController implements Controller {
  constructor(private readonly creatorImageUseCase: CreatorImage) {}

  async handle(interation: ChatInputCommandInteraction<CacheType>) {
    await interation.deferReply();
    const input = interation.options.getString('input') as string;

    if (!input) {
      await interation.reply('❌ Você precisa informar a descrição da imagem!');
      return;
    }

    await interation.editReply(
      '🔄 Estou gerando a imagem, aguarde um momento...',
    );

    const { url } = await this.creatorImageUseCase.createImage(input);

    if (url) {
      const embed = new EmbedBuilder()
        .setTitle('🎨 Imagem Gerada pela IA')
        .setDescription(`✨ **Prompt usado:**\n\`${input}\``)
        .setColor('#1E90FF')
        .setImage(url)
        .setFooter({
          text: 'Gerado com IA',
          iconURL: interation.user.displayAvatarURL(),
        });

      await interation.editReply({ embeds: [embed] });
    } else {
      await interation.editReply('❌ A resposta da IA está vazia.');
    }
  }
}
