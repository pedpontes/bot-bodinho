require('module-alias/register');
import { startBot } from './bot-app';
import { startServer } from './server';

const bootstrap = async () => {
  await startBot();
  startServer();
};

bootstrap();
