import { SlashCommandBuilder } from '@discordjs/builders';
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
import { playMusic } from '../../use-cases/play-music';
import { musicSessions } from '../../states/music-session';
import { randomUUID } from 'crypto';
import loadUrlScrappingHtml from '../../use-cases/load-url-scrapping-html';

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
  await interaction.deferReply();
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    await interaction.followUp(
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

      if (session!.queue?.length === 0) {
        session!.connection?.destroy();
        delete musicSessions[voiceChannel.id];
        return;
      }
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
  let urlRaw = interaction.options.getString('url')?.trim();

  if (!urlRaw) {
    await interaction.followUp(
      '❌ Você precisa informar um link para a música!',
    );
    return false;
  }

  if (!urlRaw.includes('https://www.youtube.com/watch?v=')) {
    urlRaw = await loadUrlScrappingHtml(urlRaw);
  }

  const url = urlRaw.split('&')[0];

  console.log(url);

  if (!ytdl.validateURL(url)) {
    await interaction.followUp('❌ URL inválida!');
    return false;
  }

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

    await interaction.followUp('🎶 TutsTuts!');
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
  await interaction.followUp('🎶 Música adicionada à fila!');
  return false;
}
