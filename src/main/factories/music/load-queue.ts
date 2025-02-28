import { LoadQueueController } from '@/modules/play/controllers/load-queue/load-queue';

export const makeLoadQueue = (): LoadQueueController => {
  return new LoadQueueController();
};
