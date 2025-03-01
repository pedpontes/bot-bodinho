import { openai } from '@/services/openai';
import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import dev from '../configs/config';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('creator')
    .setDescription('Gere imagens reais com IA')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Descrição da imagem para ser gerada')
        .setRequired(true),
    ),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    if (!dev.openaiApiKey) {
      return await interation.reply(
        '❌ Você precisa de uma chave de API OpenAI para usar este comando!',
      );
    }

    const input = interation.options.getString('input') as string;

    if (!input) {
      await interation.reply('❌ Você precisa informar a descrição da imagem!');
      return;
    }

    await interation.reply('🤖 Em desenvolvimento...');

    const response = await openai.images.generate({
      model: 'dall-e-3',
      n: 1,
      prompt: input,
      quality: 'hd',
      style: 'vivid',
      size: '1024x1024',
      response_format: 'url',
    });

    const replyContent = response.data[0].url;
    if (replyContent) {
      const embed = new EmbedBuilder()
        .setTitle('🎨 Imagem Gerada pela IA')
        .setDescription(`✨ **Prompt usado:**\n\`${input}\``)
        .setColor('#1E90FF')
        .setImage(replyContent)
        .setFooter({
          text: 'Gerado com IA',
          iconURL: interation.user.displayAvatarURL(),
        });

      await interation.editReply({ embeds: [embed] });
    } else {
      await interation.editReply('❌ A resposta da IA está vazia.');
    }
  },
};
