import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';
import { Controller, musicSessions } from '../add-music/add-music-protocols';

export class LoadQueueController implements Controller {
  constructor() {}

  async handle(
    interaction: ChatInputCommandInteraction<CacheType>,
  ): Promise<any> {
    try {
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

      if (!session.queue) {
        await interaction.followUp('🎵 A fila está vazia!');
        return;
      }

      await interaction.followUp(
        '🎵 Fila de músicas: \n' +
          session.queue
            .map((music, index) => `${index + 1} - ${music.title}`)
            .join('\n'),
      );
    } catch (error) {
      console.error(error);
      await interaction.followUp(
        '❌ Ocorreu um erro ao carregar a fila de músicas!',
      );
    }
  }
}
