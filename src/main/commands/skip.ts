import { SlashCommandBuilder } from '@discordjs/builders';
import {
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';
import { PlayMusicUseCase } from '../../modules/play/use-cases/play-music';
import { musicSessions } from '../../states/music-session';

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

  if (session.queue && session.queue.length) session.queue.shift();

  if (!session.queue || !session.queue.length) {
    session.connection?.destroy();
    delete musicSessions[voiceChannel.id];
    await interaction.reply('🎶 Não há mais músicas na fila!');
  } else {
    new PlayMusicUseCase().play(session);
    await interaction.reply({
      embeds: [
        {
          title: 'Música pulada',
          url: session.queue[0].url,
          description: `Tocando agora: **${session.queue[0].title}**`,
          image: {
            url: session.queue[0].thumbnail,
          },
          color: 0x00ff00,
          footer: {
            icon_url: member.user.avatarURL() || undefined,
            text: member.user.username,
          },
        },
      ],
    });
  }
}
