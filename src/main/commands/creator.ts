import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { openai } from '../../services/openai';
import dev from '../../config';

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

    const replyContent = response.data.map((data) => data.url).join('\n');
    if (replyContent) {
      await interation.editReply(
        'Prompt: ' + input + '\n\n' + replyContent
      );
    } else {
      await interation.editReply('❌ A resposta da IA está vazia.');
    }
  },
};
