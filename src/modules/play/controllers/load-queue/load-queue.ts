import {
  CacheType,
  ChatInputCommandInteraction,
  Controller,
  GuildMember,
  musicSessions,
} from '../add-music/add-music-protocols';

export class LoadQueueController implements Controller {
  constructor() {}

  async handle(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<any> {
    try {
      console.log(interaction.guild?.id || interaction.guildId);
      await interaction.deferReply();

      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        await interaction.followUp(
          '⚠️ Você precisa estar em um canal de voz para usar este comando!',
        );
        return;
      }

      const session = musicSessions[voiceChannel.id];

      if (!session?.queue) {
        await interaction.followUp({
          embeds: [{ description: 'Não há músicas na fila!' }],
        });
        return;
      }

      await interaction.followUp({
        embeds: [
          {
            title: 'Fila de músicas',
            description: session.queue
              .map((music, index) => `**${index + 1} - ${music.title}**`)
              .join('\n'),
            color: 0x800080,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        '❌ Ocorreu um erro ao carregar a fila de músicas!',
      );
    }
  }
}
