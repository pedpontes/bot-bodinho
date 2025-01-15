import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  CacheType,
  GuildMember,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} from '@discordjs/voice';
import fetch from 'node-fetch';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('batbox')
    .setDescription('Escutar uma musica! Coloque o link da musica!')
    .addAttachmentOption((option) =>
      option
        .setName('file')
        .setDescription('Envie um arquivo de áudio (MP3 ou WAV).')
        .setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      await interaction.reply(
        '🎶 Aguarde um momento, estou processando o arquivo de áudio!',
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

      const musicDir = path.resolve('music');
      if (!fs.existsSync(musicDir)) {
        fs.mkdirSync(musicDir);
      }

      const data = interaction.options.data[0];
      const attachment = data.attachment;

      if (
        !attachment?.name.endsWith('.mp3') &&
        !attachment?.name.endsWith('.wav')
      ) {
        await interaction.editReply(
          '⚠️ Você precisa enviar um arquivo de áudio válido (.mp3 ou .wav)!',
        );
        return;
      }

      const fileName = `audio_${Date.now()}_${attachment.name}`;
      const filePath = path.join(musicDir, fileName);

      const response = await fetch(attachment.url);
      if (!response.ok) {
        throw new Error('Erro ao baixar o arquivo de áudio.');
      }

      const audioStream = response.body;
      const writeStream = fs.createWriteStream(filePath);

      await new Promise((resolve, reject) => {
        audioStream?.pipe(writeStream);
        audioStream?.on('error', reject);
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      await interaction.followUp('✅ Arquivo de áudio salvo com sucesso!');

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const resource = createAudioResource(fs.createReadStream(filePath));
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      await interaction.editReply('🎵 Tocando agora!');

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log('Conectado ao canal de voz!');
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('Player terminou de tocar.');
        connection.destroy();
      });

      connection.on('error', (error) => {
        console.error('Erro no canal de voz:', error);
        connection.destroy();
      });
    } catch (error) {
      console.error('Erro ao executar o comando:', error);
      if (!interaction.replied) {
        await interaction.reply('❌ Ocorreu um erro ao processar o comando.');
      }
    }
  },
};
