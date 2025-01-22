import dotenv from 'dotenv';

dotenv.config();

let ytDlpPath: string;

if (process.env.NODE_ENV === 'development') {
  console.log('Rodando em ambiente de desenvolvimento');
  ytDlpPath = 'python3 -m yt-dlp';
} else if (process.env.NODE_ENV === 'production') {
  console.log('Rodando em ambiente de produção');
  ytDlpPath = 'yt-dlp';
} else {
  console.log(
    'Ambiente não especificado, utilizando o padrão: desenvolvimento',
  );
  ytDlpPath = 'python3 -m yt-dlp';
}

if (
  !process.env.TOKEN ||
  !process.env.CLIENT_ID ||
  !process.env.OPENAI_API_KEY
) {
  console.error('Erro: Faltam variáveis de ambiente necessárias.');
  process.exit(1);
}

export default {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  openaiApiKey: process.env.OPENAI_API_KEY,
  ytDlpPath,
};
