import {
  AddMusicToSession,
  CacheType,
  ChatInputCommandInteraction,
  Controller,
  GuildMember,
  LoadDetailsMusicsByUrl,
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
    } catch (error: any) {
      console.error(error);
      await interaction.followUp(`❌ ${error.message || 'Erro desconhecido'}`);
    }
  }
}
