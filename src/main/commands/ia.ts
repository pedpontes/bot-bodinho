import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { openai } from '../../services/openai';
import dev from '../configs/config';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ia')
    .setDescription('Faça perguntas para a IA')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Pergunta para a IA')
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
      await interation.reply('❌ Você precisa informar uma pergunta!');
      return;
    }

    await interation.reply('🤖 Em desenvolvimento...');

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Você é um assistente do google e deve responder a todas as perguntas o mais objetivo e claro possivel.',
        },
        { role: 'user', content: input },
      ],
      model: 'gpt-3.5-turbo',
      n: 1,
      temperature: 0.2,
      max_tokens: 1000,
    });

    const replyContent = completion.choices[0].message.content;
    if (replyContent) {
      await interation.editReply(
        '`Pergunta`:\n' + input + '\n\n`IA`:\n' + replyContent,
      );
    } else {
      await interation.editReply('❌ A resposta da IA está vazia.');
    }
  },
};
