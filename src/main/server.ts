import cors from 'cors';
import express from 'express';
import { router } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api', router);

export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
  });
};
