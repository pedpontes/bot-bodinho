import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'node:fs';
import path from 'node:path';

import env from './config';

const commands: Record<string, unknown>[] = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[AVISO] O comando em ${filePath} esta faltando "data" ou "execute" propriedade.`,
      );
    }
  }
}

(async () => {
  try {
    if (!env.token || !env.clientId) return;

    const rest = new REST().setToken(env.token);

    console.log(
      `Iniciando recarregamento ${commands.length} aplicação (/) comandos.`,
    );

    await rest.put(
      Routes.applicationGuildCommands(env.clientId, '1208438581752766484'),
      { body: commands },
    );

    const data = (await rest.put(Routes.applicationCommands(env.clientId), {
      body: commands,
    })) as unknown as { length: number };

    console.log(`Sucesso em recarregar ${data.length} aplicação (/) comandos.`);
  } catch (error) {
    console.error(error);
  }
})();
