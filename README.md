## Bot Bodinho

Insira o `token` e `clientId` do seu bot em .env, exemplo em `.env.example`.

Comandos:
 - `/play`: Tocar música com URL ou nome do youtube.
 - `/ia`: Converse com a IA.
 - `/skip`: Pular musica da playlist.
 - `/destroy`: Finalize tire o bot do canal de música e reset na playlist.
 - `/batbot`: Envie um file `.mp3` ou `.wav` para tocar.

#### Dependencias para o `/play`:

Faça a instalação do serviço de download music, instruções em https://github.com/yt-dlp/yt-dlp/wiki/Installation

Verifique se o `yt-dlp` esta corretamente instalado utilizando o comando `yt-dlp --version` 

Algo parecido com isso:
 - ![image](https://github.com/user-attachments/assets/28e110dd-7b22-4ffb-a68a-ba227cf6cc5a)

 ### Importante

 - Sempre verifique se o `yt-dlp` esteja atualizado, isso já soluciona 80% dos problemas que podem ocorrer.

 Utilize o comando `yt-dlp -U` para fazer atualizações.




