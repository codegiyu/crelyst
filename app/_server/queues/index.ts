import { mainQueue, mainQueueEvent } from './main';
// Lazy-load worker to avoid importing @react-email/render at module load time
import { logger } from '../lib/utils/logger';
// import { startBackupQueue } from '@/queues/handlers/startBackupQueue.ts';

// Lazy worker getter to defer worker initialization
async function getMainWorker() {
  const workerModule = await import('./workers');
  return workerModule.getMainWorker();
}

// TODO: Implement RETRY logic for failed or stalled jobs
export const startQueues = async () => {
  await mainQueue.waitUntilReady();
  const mainWorker = await getMainWorker();
  await mainWorker.waitUntilReady();
  await mainQueueEvent.waitUntilReady();

  // await startBackupQueue();
};

export const stopQueues = async () => {
  const mainWorker = await getMainWorker();
  await mainWorker.close();
  await mainQueue.close();
  logger.info('Queues and workers closed!');
};
