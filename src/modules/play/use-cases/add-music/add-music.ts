import { AddMusicToSession } from '@/domain/use-cases/play/add-music-to-session';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { ValidationUrl } from '@/domain/use-cases/play/validation-url';
import { musicSessions } from '@/states/music-session';
import {
  GuildMember,
  InteractionReplyOptions,
  MessagePayload,
  VoiceBasedChannel,
} from 'discord.js';
import { PlayBack } from '../playback/playback';

export type AddMusicResponse = {
  options: string | MessagePayload | InteractionReplyOptions;
};
export interface AddMusic {
  add(
    input: string,
    voiceChannel: VoiceBasedChannel,
    member: GuildMember,
  ): Promise<AddMusicResponse>;
}

export class AddMusicUseCase implements AddMusic {
  constructor(
    private readonly validationUrlUseCase: ValidationUrl,
    private readonly loadDetailsMusicsByUrlUseCase: LoadDetailsMusicsByUrl,
    private readonly addMusicToSessionUseCase: AddMusicToSession,
    private readonly playBackUseCase: PlayBack,
  ) {}

  async add(
    input: string,
    voiceChannel: VoiceBasedChannel,
    member: GuildMember,
  ): Promise<AddMusicResponse> {
    const url = await this.validationUrlUseCase.validate(input);

    const musicModel = await this.loadDetailsMusicsByUrlUseCase.load(
      url,
      voiceChannel.id,
    );

    const isFirstMusic = await this.addMusicToSessionUseCase.add(voiceChannel, [
      musicModel,
    ]);

    if (!isFirstMusic)
      return {
        options: {
          embeds: [
            {
              title: 'Música adicionada à fila',
              description: `**${musicModel.title}**`,
              color: 0x00ff00,
              url: musicModel.url,
              image: {
                url: musicModel.thumbnail,
              },
              footer: {
                icon_url: member.user.avatarURL() || undefined,
                text: member.user.username,
              },
            },
          ],
        },
      };

    let session = musicSessions[voiceChannel.id];

    if (!session) throw new Error('Sessão não encontrada');

    this.playBackUseCase.play(session, voiceChannel);

    return {
      options: {
        embeds: [
          {
            title: 'Tocando agora',
            color: 0x00ff00,
            description: `**${musicModel.title}**`,
            image: {
              url: musicModel.thumbnail,
            },
            url: musicModel.url,
            footer: {
              icon_url: member.user.avatarURL() || undefined,
              text: member.user.username,
            },
          },
        ],
      },
    };
  }
}
