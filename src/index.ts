import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import dev from './config';
import { deploy } from './deploy-commands';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

(() => {
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
      if (file.endsWith('.js')) {
        return true;
      } else if (file.endsWith('.ts')) {
        return true;
      } else {
        return false;
      }
    });

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
  } catch (error) {
    if (interation.replied || interation.deferred) {
      await interation.followUp({
        content: 'Erro ao executar este comando!',
        ephemeral: true,
      });
    } else {
      await interation.reply({
        content: 'Erro ao executar este comando!',
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
