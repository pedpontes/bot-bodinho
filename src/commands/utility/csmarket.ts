import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

type ItemCsProps = {
  link_item: string;
  hashname: string;
  price: string;
  img: string;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('csmarket')
    .setDescription('Preço de itens CS!')
    .addStringOption((option) =>
      option
        .setName('input')
        .setDescription('Insira o nome do item!')
        .setRequired(true),
    ),

  async execute(interation) {
    await interation.reply(
      'Buscando informações, isso pode levar alguns segundos...',
    );

    const url = `https://steamcommunity.com/market/search?appid=730&q=${interation.options.getString('input').split(' ').join('+')}`;
    const itensCs: ItemCsProps[] = [];
    const HTML = (await axios.get(url)).data;
    const $ = cheerio.load(HTML);

    const links = $('a.market_listing_row_link');
    const hashnames = $('span.market_listing_item_name').text().split(')');
    const imgs = $('img.market_listing_item_img');
    const prices = $('span.market_table_value.normal_price > span.normal_price')
      .text()
      .split('USD');

    links.each((_, link) => {
      itensCs.push({ link_item: link.attribs.href } as ItemCsProps);
    });

    itensCs.forEach((item, i) => {
      item.hashname = hashnames[i] + ')';
      item.price = prices[i].trim();
      item.img = imgs[i].attribs.src;
    });

    const texts = itensCs.map((item) => {
      return `Nome: ${item.hashname}\nPreço: ${item.price}\n${item.link_item}`;
    });

    let delay = 0;
    for (const text of texts) {
      setTimeout(async () => {
        await interation.followUp(text);
      }, delay);
      delay += 1000; // Intervalo de 1 segundo entre cada resposta (1000 ms = 1 segundo)
    }

    if (texts.length === 0) {
      await interation.followUp(
        `Item não encontrado ou Steam fora do ar!\n\nLink: ${url}`,
      );
    }
  },
};
