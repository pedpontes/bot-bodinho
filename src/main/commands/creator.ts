import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { makeCreatorImage } from '../factories/open-ai/creator-image';

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

  execute: (interation: ChatInputCommandInteraction<CacheType>) =>
    makeCreatorImage().handle(interation),
};
