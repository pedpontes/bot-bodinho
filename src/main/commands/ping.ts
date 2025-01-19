import { SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responder com Pong!'),

  async execute(interation: any) {
    await interation.reply('Pong!');
  },
};
