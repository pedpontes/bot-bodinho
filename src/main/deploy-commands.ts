import { env } from '@/main/configs/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';

export async function deploy(client: Client) {
  try {
    if (!env.token || !env.clientId) return;

    const rest = new REST().setToken(env.token);

    console.log(
      `Iniciando recarregamento ${client.commands.size} aplicação (/) comandos.`,
    );

    const commands = client.commands.map((command) => command.data.toJSON());

    await rest.put(
      Routes.applicationGuildCommands(env.clientId, '1208438581752766484'),
      {
        body: commands,
      },
    );

    const data = (await rest.put(Routes.applicationCommands(env.clientId), {
      body: commands,
    })) as unknown as { length: number };

    console.log(`Sucesso em recarregar ${data.length} aplicação (/) comandos.`);
  } catch (error) {
    console.error(error);
  }
}
