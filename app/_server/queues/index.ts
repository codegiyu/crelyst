import { mainQueue, mainQueueEvent } from './main';
import { mainWorker } from './workers';
import { logger } from '../lib/utils/logger';
// import { startBackupQueue } from '@/queues/handlers/startBackupQueue.ts';

// TODO: Implement RETRY logic for failed or stalled jobs
export const startQueues = async () => {
  await mainQueue.waitUntilReady();
  await mainWorker.waitUntilReady();
  await mainQueueEvent.waitUntilReady();

  // await startBackupQueue();
};

export const stopQueues = async () => {
  await mainWorker.close();
  await mainQueue.close();
  logger.info('Queues and workers closed!');
};
