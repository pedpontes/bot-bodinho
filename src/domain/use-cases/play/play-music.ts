export interface PlayMusic {
  play(channelId: string): Promise<void>;
}
