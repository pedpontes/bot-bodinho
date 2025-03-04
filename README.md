## Bot Bodinho

Insira o `token` e `clientId` do seu bot em .env, exemplo em `.env.example`.

Comandos:
 - `/skip`: Pular musica, com `option` tocar uma musica especifica da fila. `option` é o número da música na fila.   
 - `/queue`: Listar músicas da fila.
 - `/creator`: Geração de imagem com IA.
 - `/play`: Tocar música com URL do YT ou nome da música.
 - `/ia`: Converse com a IA.
 - `/skip`: Pular musica da playlist.
 - `/destroy`: Finalize tire o bot do canal de música e reset na playlist.
 - `/batbot`: Envie um file `.mp3` ou `.wav` para tocar.

#### Dependencias para o `/play`:

Faça a instalação do serviço de download music, instruções em https://github.com/yt-dlp/yt-dlp/wiki/Installation

Verifique se o `yt-dlp` esta corretamente instalado utilizando o comando `yt-dlp --version` 

Algo parecido com isso:
 - ![image](https://github.com/user-attachments/assets/48501c35-2cd5-4747-9016-4cf484f7c4ce)

O puppeteer demanda um browser para busca de musicas, caso não tenha, execute:

`npx puppeteer install`

 ### Importante

 - Sempre verifique se o `yt-dlp` esteja atualizado, isso já soluciona 80% dos problemas que podem ocorrer.

 Utilize o comando `yt-dlp -U` para fazer atualizações.




