import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export interface Controller {
  handle: (
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
}
