import { FlowModel } from '@/domain/interfaces/flowise';
import { FlowiseHelper } from '@/services/flowise';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { env } from '../configs/config';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flow')
    .setDescription('Ver os flows criados!')
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
      const flowiseHelper = new FlowiseHelper();

      const flows: FlowModel[] = await flowiseHelper.loadAllFlows({
        category: category || undefined,
      });

      if (!flows || flows.length === 0) {
        await interaction.followUp('⚠️ Nenhum flow encontrado!');
        return;
      }

      if (category) {
        const filtered = flows.filter(
          (flow) =>
            flow.category &&
            flow.category.toLowerCase().includes(category.toLowerCase()),
        );

        if (filtered.length === 0) {
          await interaction.followUp(
            `⚠️ Nenhum flow encontrado para a categoria "${category}"`,
          );
          return;
        }

        const result = filtered
          .map(
            (flow, index) =>
              `🔹 [**${flow.name}**](<${env.flowise.baseUrl}/v2/agentcanvas/${flow.id}>)\nID: ${flow.id}\n`,
          )
          .join('');

        await interaction.followUp(
          `📂 Flows encontrados na categoria **${category}**:\n\n${result}`,
        );
        return;
      }

      const groups = {
        deploy: [] as FlowModel[],
        ready: [] as FlowModel[],
        dev: [] as FlowModel[],
      };

      for (const flow of flows) {
        const cat = flow.category?.toLowerCase() || '';
        if (cat.includes('deploy')) groups.deploy.push(flow);
        else if (cat.includes('ready')) groups.ready.push(flow);
        else if (cat.includes('dev')) groups.dev.push(flow);
      }

      const formatGroup = (title: string, group: FlowModel[]) => {
        if (group.length === 0) return '';
        const items = group
          .map(
            (flow, index) =>
              `🔹 [**${flow.name}**](<${env.flowise.baseUrl}/v2/agentcanvas/${flow.id}>)\nID: ${flow.id}\n`,
          )
          .join('');
        return `**${title}**\n\n${items}\n`;
      };

      const response =
        formatGroup('🟢 Em Produção (DEPLOY)', groups.deploy) +
        formatGroup('🟡 Pronto para subir (READY)', groups.ready) +
        formatGroup('🔵 Em Desenvolvimento (DEV)', groups.dev);

      await interaction.followUp(response.trim());
    } catch (error) {
      console.error(error);
      await interaction.followUp('⚠️ Ocorreu um erro ao buscar os flows!');
    }
  },
};
