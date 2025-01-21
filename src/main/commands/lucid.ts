import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { openai } from '../../services/openai';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lucid')
    .setDescription('Gera uma história com base em um contexto para RPG')
    .addStringOption((option) => option.setName('context').setDescription('Contexto da história').setRequired(true))
    .addStringOption((option) => option.setName('details').setDescription('Detalhes do personagem').setRequired(true)),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    await interation.deferReply();

    const context = interation.options.getString('context');
    const details = interation.options.getString('details');

    if (!details || !context) {
      await interation.editReply('⚠️ O contexto e os detalhes do personagem são obrigatórios!');
      return;
    }

    const prompt = `
Você é um contador de histórias criativo e deve criar uma narrativa curta e interessante para um personagem de RPG, com base no contexto fornecido pelo usuário. A história deve ser concisa, com no máximo 10 linhas, e destacar um momento significativo da vida do personagem, levando em consideração a sua cultura e o ambiente em que vive. Seja criativo e envolvente, mas mantenha a narrativa objetiva e curta.

As informações vêm neste formato:
<critérios>
<contexto>
<detalhes>
</critérios>

`;

    const input = `
    <critérios>
    <contexto>${context}</contexto>
    <detalhes>${details}</detalhes>
    </critérios>
    `

    const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content:
                prompt,
          },
          { role: 'user', content: input },
        ],
        model: 'gpt-3.5-turbo',
        n: 1,
        temperature: 0.7,
        max_tokens: 200,
      });

    const replyContent = completion.choices[0].message.content;

    if (!replyContent) {
      await interation.editReply('❌ A resposta da IA está vazia.');
      return;
    }

    const embed = createNamesEmbed(replyContent, details);

    if (replyContent)
      await interation.editReply({ embeds: [embed] });
    }
};

function createNamesEmbed(responseText: string, details: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(0x0099ff)  // Cor do embed
        .setTitle('História do Personagem')
        .setDescription('Aqui está a história do seu personagem, criada a partir do contexto fornecido.')
        .addFields(
          {
            name: 'Personagem:',
            value: details,
            inline: true,
          },
          {
            name: 'História:',
            value: responseText,  // Resposta gerada pelo modelo (substitua por `completion.choices[0].message.content`)
            inline: false,
          }
        )
        .setFooter({ text: 'Gerado pelo Assistente de RPG' });
  }