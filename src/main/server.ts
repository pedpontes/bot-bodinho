import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { router } from './routes';
import { webhookRouter } from './routes/webhook/webhook.routes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api', router);
app.use('/webhook', webhookRouter);
app.use('/', (_, res) => {
  res.status(200).send('[API] [v1] Servidor rodando');
});

export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor HTTP rodando na porta ${PORT}`);
  });
};
