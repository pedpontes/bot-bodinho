import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('destroy')
    .setDescription('Tirar o bot do canal de voz'),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    const connection = getVoiceConnection(interation.guild?.id as string);

    if (connection) {
      connection.destroy();
      await interation.reply('✅ Bot desconectado do canal de voz!');
      return;
    }
    await interation.reply('❌ Bot não está conectado a nenhum canal de voz!');
  },
};
