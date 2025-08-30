import { AddMusicToSession } from '@/domain/use-cases/play/add-music-to-session';
import { LoadDetailsMusicsByUrl } from '@/domain/use-cases/play/load-details-musics-by-url';
import { ValidationUrl } from '@/domain/use-cases/play/validation-url';
import { MusicSessionRepository } from '@/infra/music-session/music-session-repository';
import { getVoiceConnection } from '@discordjs/voice';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
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
    private readonly musicSessionRepository: MusicSessionRepository,
  ) {}

  async add(
    input: string,
    voiceChannel: VoiceBasedChannel,
    member: GuildMember,
  ): Promise<AddMusicResponse> {
    const url = await this.validationUrlUseCase.validate(input);

    let session = this.musicSessionRepository.load(voiceChannel.id);

    if (!session) {
      session = this.musicSessionRepository.add(voiceChannel.id, {
        connection: undefined,
        player: undefined,
        queue: [],
      });
    }

    const musicModel = await this.loadDetailsMusicsByUrlUseCase.load(
      url,
      voiceChannel.id,
    );

    const alreadyJoinedVoiceChannel = getVoiceConnection(voiceChannel.guild.id);

    console.log('Esta num canal de voz:', alreadyJoinedVoiceChannel);

    if (!alreadyJoinedVoiceChannel) {
      await this.playBackUseCase.play(voiceChannel);
    }

    if (session.queue && session.queue.length) {
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
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId('queue')
                .setLabel('📋 Ver fila')
                .setStyle(ButtonStyle.Secondary),
            ),
          ],
        },
      };
    }

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
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId('skip')
              .setLabel('⏭️ Próxima música')
              .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
              .setCustomId('queue')
              .setLabel('📋 Ver fila')
              .setStyle(ButtonStyle.Secondary),
          ),
        ],
      },
    };
  }
}
