import { CacheType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { openai } from '../../services/openai';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('genames')
    .setDescription('Gera uma quantidade de nomes aleatórios')
    .addStringOption((option) => option.setName('context').setDescription('Contexto do nome').setRequired(true))
    .addIntegerOption((option) => option.setName('quantidade').setDescription('Número de nomes a serem gerados').setRequired(true)),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    await interation.deferReply();

    const context = interation.options.getString('context');
    const quantidade = interation.options.getInteger('quantidade');

    if (!quantidade || quantidade <= 0) {
      await interation.editReply('⚠️ O número de nomes deve ser maior que 0!');
      return;
    }

    const prompt = `
Você é um gerador de nomes altamente criativo e coerente. Seu objetivo é gerar uma quantidade específica de nomes aleatórios com base no contexto fornecido. Seja consistente e siga todas as restrições especificadas. Gere os nomes separados por vírgulas.

As informações vêm neste formato:
<restrições>
<quantidade>
<contexto>
</restrições>

Certifique-se de que os nomes sejam apropriados e aderentes ao contexto descrito.
**Atenção:** Caso o contexto fornecido seja inapropriado, ofensivo, ou viole regras éticas, **não gere nomes**. Em vez disso, retorne a mensagem: "O contexto fornecido não é apropriado para gerar nomes."
    `;

    const input = `
    <restrições>
    <quantidade>${quantidade}</quantidade>
    <contexto>${context || 'Nomes atuais da capital e do interior'}</contexto>
    </restrições>`

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
        temperature: 0.3,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.2,
      });

    const replyContent = completion.choices[0].message.content?.split(',');

    if (!replyContent) {
      await interation.editReply('❌ A resposta da IA está vazia.');
      return;
    }

    const embed = createNamesEmbed(replyContent, context || 'Nomes atuais da capital e do interior');

    if (replyContent)
      await interation.editReply({ embeds: [embed] });
    }
};

function createNamesEmbed(names: string[], context: string) {
    return new EmbedBuilder()
      .setColor('#5865F2') // Escolha uma cor para o embed
      .setTitle('📜 Nomes Gerados')
      .setDescription(`Aqui estão os nomes gerados com base no contexto: **${context}**.`)
      .addFields(
        {
          name: '📝 Lista de Nomes',
          value: names.join(', ') || 'Nenhum nome foi gerado.',
        }
      )
      .setFooter({ text: 'Gerador de Nomes Criativos' })
      .setTimestamp();
  }