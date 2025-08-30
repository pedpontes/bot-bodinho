import { AddMusic } from '../../use-cases/add-music/add-music';
import {
  CacheType,
  ChatInputCommandInteraction,
  Controller,
  GuildMember,
} from './add-music-protocols';

export class AddMusicController implements Controller {
  constructor(private readonly addMusicUseCase: AddMusic) {}

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

      const { options } = await this.addMusicUseCase.add(
        input,
        voiceChannel,
        member,
      );

      await interaction.followUp(options);
    } catch (error: any) {
      console.error(error);
      await interaction.followUp(`❌ ${error.message || 'Erro desconhecido'}`);
    }
  }
}
