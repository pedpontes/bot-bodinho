import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dado')
    .setDescription('Jogar o dado e gastar sua sorte!')
    .addIntegerOption((option) => option.setName('lados').setDescription('Número de lados do dado').setRequired(true))
    .addIntegerOption((option) => option.setName('quantidade').setDescription('Número de dados a serem jogados').setRequired(true))
    .addIntegerOption((option) => option.setName('bonus').setDescription('Bônus a ser adicionado ao resultado').setRequired(false)),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    await interation.deferReply();

    const lados = interation.options.getInteger('lados');
    const quantidade = interation.options.getInteger('quantidade');
    const bonus = interation.options.getInteger('bonus') || 0;

    if (!lados || !quantidade || lados <= 0 || quantidade <= 0) {
      await interation.editReply('⚠️ O número de lados e a quantidade de dados devem ser maiores que 0!');
      return;
    }

    const results = [];

    for (let i = 0; i < quantidade; i++) {
      results.push(Math.floor(Math.random() * lados) + 1);
    }

    const total = results.reduce((acc, cur) => acc + cur, 0) + bonus;

    await interation.editReply(`🎲 Resultados: ${results.join(', ')}\n🎲 Total: ${total}`);
  },
};
