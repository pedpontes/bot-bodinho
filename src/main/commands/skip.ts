import { MusicSessionStateRepository } from '@/infra/music-session/music-session-repository';
import { PlayMusicUseCase } from '@/modules/play/use-cases/play-music';
import { PlayBackUseCase } from '@/modules/play/use-cases/playback/playback';
import { YtdlHelper } from '@/services/ytdl';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  GuildMember,
} from 'discord.js';
import { musicSessions } from '../../states/music-session';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pular para a próxima música!')
    .addIntegerOption((option) =>
      option
        .setMinValue(1)
        .setName('music')
        .setDescription(
          'Número da música na fila, utilize /queue para ver a lista',
        )
        .setRequired(false),
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) =>
    await execute(interaction),
};

async function execute(interaction: ChatInputCommandInteraction<CacheType>) {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;
  const musicNumber = interaction?.options?.getInteger('music') ?? undefined;

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

  if (session.queue && session.queue.length && !musicNumber)
    session.queue.shift();

  if (session.queue && session.queue.length && musicNumber) {
    const index = musicNumber - 1;
    if (index < 0 || index >= session.queue.length) {
      await interaction.reply('⚠️ Número de música inválido!');
      return;
    }
    session.queue = session.queue.filter((_, i) => i >= index);
  }

  if (!session.queue || !session.queue.length) {
    session.connection?.destroy();
    delete musicSessions[voiceChannel.id];
    await interaction.reply('🎶 Não há mais músicas na fila!');
  } else {
    new PlayBackUseCase(
      new PlayMusicUseCase(new YtdlHelper()),
      new MusicSessionStateRepository(),
    ).play(voiceChannel);

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
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('⏭️ Próxima música')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('queue')
            .setLabel('📋 Ver fila')
            .setStyle(ButtonStyle.Secondary),
        ),
      ],
    });
  }
}
