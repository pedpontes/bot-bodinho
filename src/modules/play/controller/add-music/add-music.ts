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
        await interaction.followUp('🎶 Música adicionada à fila!');
        return;
      }
      await interaction.followUp('🎶 Música tocando! \n' + url);

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
