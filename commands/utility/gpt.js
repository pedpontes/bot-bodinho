const { SlashCommandBuilder } = require("discord.js");
const { openaiKey } = require("../../config.json");
const OpenAI = require("openai");
const openai = new OpenAI({apiKey: openaiKey});

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("IA vai responder sua pergunta!")
        .addStringOption(option => 
            option.setName('input')
                .setDescription("Insira a pergunta para obter a resposta!")
                .setRequired(true)
        ),
        
    async execute(interation) {

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: interation.options.getString('input') }],
            model: "gpt-3.5-turbo",
            n: 1,
            temperature: 0.2,
            max_tokens: 3000,
        });

        await interation.reply(completion.choices[0])
    },
}