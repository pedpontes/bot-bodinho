import {
  Controller,
  ChatInputCommandInteraction,
  CacheType,
  ValidationUrl,
  AddMusicToSession,
  PlayMusic,
  GuildMember,
  musicSessions,
  createAudioPlayer,
  joinVoiceChannel,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  EmbedBuilder,
} from './add-music-protocols';

export class AddMusicController implements Controller {
  constructor(
    private readonly validationUrlUseCase: ValidationUrl,
    private readonly addMusicToSessionUseCase: AddMusicToSession,
    private readonly playMusicUseCase: PlayMusic,
  ) {}

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

      let input = interaction.options.getString('input')?.trim();

      if (!input) {
        await interaction.followUp(
          '❌ Você precisa informar um link ou nome para a música!',
        );
        return;
      }

      const url = (await this.validationUrlUseCase.validate(input)).split(
        '&',
      )[0];

      const isFirstMusic = await this.addMusicToSessionUseCase.add(
        voiceChannel,
        url,
      );

      if (!isFirstMusic) {
        const embed = new EmbedBuilder()
          .setTitle('🎵 Adicionado à fila')
          .setDescription(`${url}`)
          .setColor(0x1db954)
          .setFooter({ text: 'Jajá irei tocar sua música!' })
          .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🎵 Tocando agora')
        .setDescription(`${url}`)
        .setColor(0x1db954)
        .setFooter({ text: 'Aproveite a música!' })
        .setTimestamp();

      await interaction.followUp({ embeds: [embed] });

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

      musicSessions[voiceChannel.id] = {
        ...session,
        player,
        connection,
      };

      await this.playMusicUseCase.play(musicSessions[voiceChannel.id]);

      player.on(AudioPlayerStatus.Idle, async () => {
        session!.queue?.shift();

        if (session!.queue?.length === 0) {
          session!.connection?.destroy();
          delete musicSessions[voiceChannel.id];
          return;
        }
        await this.playMusicUseCase.play(session);
      });
    } catch (error: any) {
      console.error(error);
      await interaction.followUp(`❌ ${error.message || 'Erro desconhecido'}`);
    }
  }
}
