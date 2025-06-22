import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dump')
    .setDescription('Carregar o ultimo dump do Flowise!')
    .addStringOption((option) =>
      option
        .setName('categoria')
        .setDescription('Insira a categoria do flow!')
        .setRequired(false),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      await interaction.deferReply();
      const category = interaction.options.getString('categoria');
    } catch (error) {
      console.error(error);
      await interaction.followUp('⚠️ Ocorreu um erro ao buscar os flows!');
    }
  },
};
