import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { makeLoadQueue } from '../factories/music/load-queue';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Listar as músicas na fila!'),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    await makeLoadQueue().handle(interaction),
};
