import { CommandInteraction } from 'discord.js';

export interface CommandModel {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
}
