import { SlashCommandBuilder, GuildMember } from 'discord.js';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import deleteAllByChannelId from '../../use-cases/delete-musics-by-channel-id';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('destroy')
    .setDescription('Tirar o bot do canal de voz'),

  async execute(interation: ChatInputCommandInteraction<CacheType>) {
    const connection = getVoiceConnection(interation.guild?.id as string);

    if (connection) {
      const channelId = connection.joinConfig.channelId;

      const member = interation.member as GuildMember;
      const voiceChannel = member.voice.channel;

      if (channelId !== voiceChannel?.id) {
        await interation.reply(
          '❌ Você precisa estar no mesmo canal de voz que o bot!',
        );
        return;
      }

      await deleteAllByChannelId(channelId);

      connection.destroy();
      await interation.reply('✅ Bot desconectado do canal de voz!');
      return;
    }
    await interation.reply('❌ Bot não está conectado a nenhum canal de voz!');
  },
};
