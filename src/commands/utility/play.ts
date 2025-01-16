import { SlashCommandBuilder } from '@discordjs/builders';
import { spawn } from 'child_process';
import {
  ChatInputCommandInteraction,
  CacheType,
  GuildMember,
} from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import ytdl from 'ytdl-core';
import addMusicToQueeue from '../../use-cases/add-music-to-queeue';
import loadMusicByChannelId from '../../use-cases/load-music-by-channel';
import deleteMusicById from '../../use-cases/delete-music-by-id';
import deleteAllByChannelId from '../../use-cases/delete-musics-by-channel-id';

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

  execute: async (
    interaction: ChatInputCommandInteraction<CacheType>,
    recursive?: boolean,
  ) => await execute(interaction, recursive),
};

async function execute(
  interaction: ChatInputCommandInteraction<CacheType>,
  recursive?: boolean,
) {
  const member = interaction.member as GuildMember;
  const voiceChannel = member.voice.channel;

  if (!voiceChannel) {
    await interaction.reply(
      '⚠️ Você precisa estar em um canal de voz para usar este comando!',
    );
    return;
  }

  try {
    if (!recursive) {
      const urlRaw = interaction.options.getString('url')?.trim();

      if (!urlRaw) {
        await interaction.reply(
          '❌ Você precisa informar um link para a música!',
        );
        return;
      }

      const url = urlRaw.split('&')[0];

      if (!ytdl.validateURL(url))
        return await interaction.reply('❌ URL inválida!');

      const channel = await loadMusicByChannelId(voiceChannel.id);

      if (channel && channel.queeue.length > 0)
        await interaction.reply('🎶 Adicionado a fila!');
      else await interaction.reply('🎶 TutsTuts!');

      await addMusicToQueeue(voiceChannel.id, url);
    }

    const channelMusic = await loadMusicByChannelId(voiceChannel.id);

    if (!channelMusic) {
      return;
    }

    const { stderr, stdout } = spawn('python3', [
      '-m',
      'yt_dlp',
      '-q',
      '-x',
      '--audio-format',
      'mp3',
      '-o',
      '-',
      channelMusic.queeue[0].url,
    ]);

    let resource = createAudioResource(stdout);

    let player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    stderr.on('data', async (data) => {
      await deleteAllByChannelId(channelMusic.id);
      if (
        connection &&
        connection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        connection.destroy();
      }
      throw new Error(data.toString());
    });

    player.play(resource);
    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Conectado ao canal de voz!');
    });

    player.on(AudioPlayerStatus.Idle, async () => {
      await deleteMusicById(channelMusic.queeue[0].id);

      const nextMusic = await loadMusicByChannelId(voiceChannel.id);
      if (nextMusic && nextMusic.queeue.length > 0) {
        await execute(interaction, true);
        return;
      }

      console.log('Player terminou de tocar.');
      if (
        connection &&
        connection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        connection.destroy();
      }
      return;
    });

    connection.on('error', async (error) => {
      await deleteAllByChannelId(channelMusic.id);
      console.error('Erro no canal de voz:', error);
      if (
        connection &&
        connection.state.status !== VoiceConnectionStatus.Destroyed
      ) {
        connection.destroy();
      }
      return;
    });
  } catch (error) {
    console.error('Erro ao executar o comando:', error);
    if (!interaction.replied) {
      await interaction.editReply('❌ Ocorreu um erro ao processar o comando.');
    }
  }
}
