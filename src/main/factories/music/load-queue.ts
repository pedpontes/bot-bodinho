import { LoadQueueController } from '@/modules/bot/play/controllers/load-queue/load-queue';

export const makeLoadQueue = (): LoadQueueController => {
  return new LoadQueueController();
};
