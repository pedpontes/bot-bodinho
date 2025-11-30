import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { webhookRouter } from './routes/webhook/webhook.routes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/', (_, res) => {
  res.status(200).send('[API] [v1] Servidor rodando');
});

app.use('/api', router);
app.use('/webhook', webhookRouter);

export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
  });
};
