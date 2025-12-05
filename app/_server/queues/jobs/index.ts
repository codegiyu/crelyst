import { JobData } from '../../lib/types/queues';
import { mainQueue } from '../main';
import { logger } from '../../lib/utils/logger';

export const addJobToQueue = async (payload: JobData) => {
  const { type, priority, delay } = payload;

  try {
    return await mainQueue.add(type, payload, {
      priority: priority ?? 2,
      delay: delay ?? 0,
    });
  } catch (error) {
    logger.error('Error enqueueing job:', { error, payload });
  }
};
