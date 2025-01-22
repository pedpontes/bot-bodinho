## Bot Bodinho

Insira o `token` e `clientId` do seu bot em .env, exemplo em `.env.example`.

Comandos:
 - `/play`: Tocar música com URL ou nome do youtube.
 - `/ia`: Converse com a IA.
 - `/skip`: Pular musica da playlist.
 - `/destroy`: Finalize tire o bot do canal de música e reset na playlist.
 - `/batbot`: Envie um file `.mp3` ou `.wav` para tocar.

#### Dependencias para o `/play`:

Faça download do `yt-dlp`, repo: https://github.com/yt-dlp/yt-dlp, instale `python` e coloque o diretório do `yt-dlp` na lista de váriaveis globais do sistema ( PATH ).

Para testar se o yt-dlp esta corretamente configurado e instalado, utilize `python3 -m yt_dlp --version`.

Algo parecido com isso:
 - ![image](https://github.com/user-attachments/assets/28e110dd-7b22-4ffb-a68a-ba227cf6cc5a)




