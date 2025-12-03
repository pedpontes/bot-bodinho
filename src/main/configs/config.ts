import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'development') {
  console.log('Rodando em ambiente de desenvolvimento');
} else if (process.env.NODE_ENV === 'production') {
  console.log('Rodando em ambiente de produção');
} else {
  console.log(
    'Ambiente não especificado, utilizando o padrão: desenvolvimento',
  );
}

export const env = {
  ytl: {
    email: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  oauth: {
    discord: {
      clientSecret: process.env.OAUTH2_CLIENT_SECRET,
      redirectUri: process.env.OAUTH2_REDIRECT_URI,
      clientId: process.env.OAUTH2_CLIENT_ID,
    },
  },
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  openaiApiKey: process.env.OPENAI_API_KEY,
  flowise: {
    baseUrl: process.env.FLOWISE_BASE_URL,
    apiKey: process.env.FLOWISE_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
