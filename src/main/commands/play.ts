import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { makePlayMusic } from '../factories/music/add-music';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Escutar uma musica!')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Insira URL ou nome da música!')
        .setRequired(true),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    await makePlayMusic().handle(interaction),
};
