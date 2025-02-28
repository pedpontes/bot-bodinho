import { MusicSession, musicSessions } from '@/states/music-session';
import { joinVoiceChannel } from '@discordjs/voice';

export class AddMusicToSessionObserver {
  constructor() {}

  addMusicToSession() {
    return new Proxy(musicSessions, {
      set(target, key, value: MusicSession) {
        const isNew = !target.hasOwnProperty(key);

        if (isNew && value.voiceChannel && !value.connection) {
          console.log(
            `🎶 Primeira música na fila! Conectando ao canal ${value.voiceChannel.name}...`,
          );

          value.connection = joinVoiceChannel({
            channelId: value.voiceChannel.id,
            guildId: value.voiceChannel.guild.id,
            adapterCreator: value.voiceChannel.guild.voiceAdapterCreator,
          });
        }

        target[key as string] = value;
        return true;
      },
    });
  }
}

export const addMusicToSessionObserver = new AddMusicToSessionObserver()
  .addMusicToSession;
