require('module-alias/register');
import dev from '@/main/configs/config';
import { deploy } from '@/main/deploy-commands';
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

(() => {
  const commandsPath = path.join(__dirname, 'commands');

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[AVISO] O comando em ${filePath} esta faltando "data" ou "execute" propriedade.`,
      );
    }
  }
  deploy(client);
})();

client.on(Events.InteractionCreate, async (interation) => {
  if (!interation.isChatInputCommand()) return;

  const command = interation.client.commands.get(interation.commandName);

  if (!command) {
    interation.reply(`Nenhum comando encontrado ${interation.commandName}`);
    return;
  }

  try {
    await command.execute(interation);
  } catch (error: any) {
    console.error(error);
    if (interation.replied || interation.deferred) {
      await interation.followUp({
        content: error.message || 'Erro desconhecido!',
        ephemeral: true,
      });
    } else {
      await interation.reply({
        content: error.message || 'Erro desconhecido!',
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, (readyClient: Client) => {
  console.log(`Pronto! Logado em ${readyClient.user?.tag}`);
});

client.on(Events.Error, (error) => {
  console.log({
    message: 'Erro inesperado!',
    error,
  });
});

client.login(dev.token);
