const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Responder com Pong!"),

    async execute(interation) {
        await interation.reply("Pong!")
    },
}