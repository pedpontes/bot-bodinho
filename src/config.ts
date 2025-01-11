import dotenv from 'dotenv';

dotenv.config();

export default {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
};
