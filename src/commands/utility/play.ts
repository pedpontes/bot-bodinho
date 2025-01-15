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

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
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

    try {
      const { stderr, stdout } = spawn('python3', [
        '-m',
        'yt_dlp',
        '-q',
        '-x',
        '--audio-format',
        'mp3',
        '-o',
        '-',
        url,
      ]);

      stderr.on('data', (data) => {
        throw new Error(data.toString());
      });

      await interaction.reply(
        '🎶 Aguarde um momento, estou procurando a música!',
      );

      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        await interaction.editReply({
          content:
            '⚠️ Você precisa estar em um canal de voz para usar este comando!',
        });
        return;
      }

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

      player.play(resource);
      connection.subscribe(player);

      await interaction.editReply('🎵 Tocando agora!');

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Conectado ao canal de voz!');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('Player terminou de tocar.');
        connection.destroy();
        return;
      });

      connection.on('error', (error) => {
        console.error('Erro no canal de voz:', error);
        connection.destroy();
        return;
      });
    } catch (error) {
      console.error('Erro ao executar o comando:', error);
      if (!interaction.replied) {
        await interaction.reply('❌ Ocorreu um erro ao processar o comando.');
      }
    }
  },
};
