import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Escutar uma musica! Coloque o link da musica!'),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    await interation.reply('Pong!');
  },
};
