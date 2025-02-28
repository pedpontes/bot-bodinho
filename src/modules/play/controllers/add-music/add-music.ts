import {
  AddMusicToSession,
  AudioPlayerStatus,
  CacheType,
  ChatInputCommandInteraction,
  Controller,
  createAudioPlayer,
  GuildMember,
  LoadDetailsMusicsByUrl,
  musicSessions,
  NoSubscriberBehavior,
  PlayMusic,
  ValidationUrl,
} from './add-music-protocols';

export class AddMusicController implements Controller {
  constructor(
    private readonly validationUrlUseCase: ValidationUrl,
    private readonly addMusicToSessionUseCase: AddMusicToSession,
    private readonly playMusicUseCase: PlayMusic,
    private readonly loadDetailsMusicsByUrlUseCase: LoadDetailsMusicsByUrl,
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

      const url = await this.validationUrlUseCase.validate(input);

      await this.loadDetailsMusicsByUrlUseCase.load(url, voiceChannel);

      // await this.addMusicToSessionUseCase.add(voiceChannel, musicsModel);

      const player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      player.on(AudioPlayerStatus.Idle, async () => {
        session = musicSessions[voiceChannel.id];

        if (!session) return;

        session.queue?.shift();

        if (!session.queue || !session.queue.length) {
          setTimeout(() => {
            const sessionCurrent = musicSessions[voiceChannel.id];
            if (!sessionCurrent.queue || !sessionCurrent.queue.length)
              session.connection?.destroy();
            delete musicSessions[voiceChannel.id];
            return;
          }, 10000);
        }
        await this.playMusicUseCase.play(session);
      });
    } catch (error: any) {
      console.error(error);
      await interaction.followUp(`❌ ${error.message || 'Erro desconhecido'}`);
    }
  }
}
