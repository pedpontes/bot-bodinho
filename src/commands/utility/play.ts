import { SlashCommandBuilder } from '@discordjs/builders';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import {
  ChatInputCommandInteraction,
  CacheType,
  GuildMember,
  VoiceBasedChannel,
} from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import addMusicToQueeue from '../../use-cases/add-music-to-queeue';
import loadMusicByChannelId from '../../use-cases/load-music-by-channel';
import deleteMusicById from '../../use-cases/delete-music-by-id';
import deleteAllByChannelId from '../../use-cases/delete-musics-by-channel-id';
import { playMusic } from '../../use-cases/play-music';
import { musicSessions } from '../../states/music-session';
import { info } from 'console';
import { randomUUID } from 'crypto';

export type Queeue = {
  url: string;
  createdAt: Date;
  id: string;
  updatedAt: Date;
  title: string | null;
  artist: string | null;
  album: string | null;
  channelId: string;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Escutar uma musica!')
    .addStringOption((option) =>
      option
        .setName('url')
        .setDescription('Envie uma url do YT!')
        .setRequired(true),
    ),
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

  try {
    const firstMusic = await validationUrlAndAddMusicToChannel(
      interaction,
      voiceChannel,
    );

    if (!firstMusic) {
      return;
    }

    let session = musicSessions[voiceChannel.id];

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    session = {
      ...session,
      player,
      connection,
    };

    musicSessions[voiceChannel.id] = session;

    playMusic(session);

    player.on(AudioPlayerStatus.Idle, async () => {
      session!.queue?.shift();

      if (session!.queue?.length === 0) return session!.connection?.destroy();
      playMusic(session);
    });
  } catch (error) {
    console.error('Erro ao executar o comando:', error);
    delete musicSessions[voiceChannel.id];
    if (!interaction.replied) {
      await interaction.editReply('❌ Ocorreu um erro ao processar o comando.');
    }
  }
}

async function validationUrlAndAddMusicToChannel(
  interaction: ChatInputCommandInteraction<CacheType>,
  voiceChannel: VoiceBasedChannel,
): Promise<boolean> {
  const urlRaw = interaction.options.getString('url')?.trim();

  if (!urlRaw) {
    await interaction.reply('❌ Você precisa informar um link para a música!');
    return false;
  }

  const url = urlRaw.split('&')[0];

  if (!ytdl.validateURL(url)) {
    await interaction.reply('❌ URL inválida!');
    return false;
  }

  // const infoUrl = await ytdl.getInfo(url);

  const session = musicSessions[voiceChannel.id];

  if (!session) {
    musicSessions[voiceChannel.id] = {
      player: undefined,
      connection: undefined,
      queue: [
        {
          url,
          createdAt: new Date(),
          id: randomUUID(),
          updatedAt: new Date(),
          title: '',
          artist: '',
          album: null,
          channelId: voiceChannel.id,
        },
      ],
    };

    await interaction.reply('🎶 TutsTuts!');
    return true;
  } else {
    session.queue?.push({
      url,
      createdAt: new Date(),
      id: randomUUID(),
      updatedAt: new Date(),
      title: '',
      artist: '',
      album: null,
      channelId: voiceChannel.id,
    });
  }

  if (session.player && session.connection && session.queue!.length > 0) {
    await interaction.reply('🎶 Música adicionada à fila!');
    return false;
  } else {
    await interaction.reply('🎶 TutsTuts!');
    return true;
  }
}
