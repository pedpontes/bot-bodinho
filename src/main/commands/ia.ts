import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { makeIaCompletion } from '../factories/open-ai/ia-completion';

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

  execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    await makeIaCompletion().handle(interaction),
};
