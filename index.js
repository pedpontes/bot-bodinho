const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[AVISO] O comando em ${filePath} esta faltando "data" ou "execute" propriedade.`);
		}
	}
}

client.on(Events.InteractionCreate, async interation => {
    if(!interation.isChatInputCommand()) return;

    const command = interation.client.commands.get(interation.commandName);

    if(!command){
        console.error(`Nenhum comando encontrado ${interation.commandName}`);
        return;
    }

    try {
        await command.execute(interation);
    } catch (error) {
        console.error(error);
        if (interation.replied || interation.deferred) {
			await interation.followUp({ content: 'Erro ao executar este comando!', ephemeral: true });
		} else {
			await interation.reply({ content: 'Erro ao executar este comando!', ephemeral: true });
		}
    }
});

//evento caso conecte ao servidor discord
client.once(Events.ClientReady, readyClient => {
    console.log(`Pronto! Logado em ${readyClient.user.tag}`);
});

//logar o bot no discord
client.login(token);