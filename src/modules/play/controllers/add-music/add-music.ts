import {
  AddMusicToSession,
  AudioPlayerStatus,
  CacheType,
  ChatInputCommandInteraction,
  Controller,
  createAudioPlayer,
  GuildMember,
  joinVoiceChannel,
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

      const musicModel = await this.loadDetailsMusicsByUrlUseCase.load(
        url,
        voiceChannel.id,
      );

      const isFirstMusic = await this.addMusicToSessionUseCase.add(
        voiceChannel,
        [musicModel],
      );

      if (!isFirstMusic) {
        await interaction.followUp({
          embeds: [
            {
              title: 'Música adicionada à fila',
              description: `**${musicModel.title}**`,
              color: 0x00ff00,
              url: url,
              image: {
                url: musicModel.thumbnail,
              },
              footer: {
                icon_url: member.user.avatarURL() || undefined,
                text: member.user.username,
              },
            },
          ],
        });
        return;
      }

      await interaction.followUp({
        embeds: [
          {
            title: 'Tocando agora',
            color: 0x00ff00,
            description: `**${musicModel.title}**`,
            image: {
              url: musicModel.thumbnail,
            },
            url: url,
            footer: {
              icon_url: member.user.avatarURL() || undefined,
              text: member.user.username,
            },
          },
        ],
      });

      let session = musicSessions[voiceChannel.id];

      if (!session) throw new Error('Sessão não encontrada');

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
