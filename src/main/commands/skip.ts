import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  CacheType,
  GuildMember,
} from 'discord.js';
import { musicSessions } from '../../states/music-session';
import { PlayMusicUseCase } from '../../modules/play/use-case/play-music';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pular para a próxima música!'),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    await execute(interaction),
};

async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    await interaction.reply(
      '⚠️ Você precisa estar em um canal de voz para usar este comando!',
    );
    return;
  }

  const session = musicSessions[voiceChannel.id];

  if (!session || !session.connection || !session.player) {
    await interaction.reply('❌ Não há músicas tocando neste canal!');
    return;
  }

  if (session.queue && session.queue?.length > 0) {
    session!.queue?.shift();
  }

  if (!session.queue || session.queue?.length === 0) {
    session.connection.destroy();
    delete musicSessions[voiceChannel.id];
    await interaction.reply('🎶 Não há mais músicas na fila!');
  } else {
    new PlayMusicUseCase().play(session);
    await interaction.reply('⏭️ Música pulada!');
  }
}
