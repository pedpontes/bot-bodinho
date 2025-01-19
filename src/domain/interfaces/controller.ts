import { ChatInputCommandInteraction, CacheType } from 'discord.js';

export interface Controller {
  handle: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<any>;
}
