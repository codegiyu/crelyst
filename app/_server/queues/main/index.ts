import { JobData, JOB_TYPE } from '../../lib/types/queues';
import { logger } from '../../lib/utils/logger';
import { redisCache } from '../../lib/utils/redis';
import { Queue, QueueEvents } from 'bullmq';
import { getEmailLog, updateEmailStatus } from '../../lib/utils/emailTracking';

// Create a new connection in every node instance
const mainQueue = new Queue<JobData>('mainQueue', {
  connection: redisCache,
  prefix: 'queue',
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// EVENT LISTENERS
// create a queue event listener
const mainQueueEvent = new QueueEvents('mainQueue', { connection: redisCache });

// Email job types that should be tracked
const EMAIL_JOB_TYPES: readonly JOB_TYPE[] = [
  'verificationCode',
  'resetPassword',
  'inviteAdmin',
] as const;

mainQueueEvent.on('failed', async ({ jobId, failedReason }) => {
  logger.error(`Job ${jobId} failed with error ${failedReason}`);

  // Update email log status if this is an email job
  try {
    const emailLog = await getEmailLog({ jobId });
    if (emailLog && EMAIL_JOB_TYPES.includes(emailLog.type)) {
      // Only update if status is still pending (handler might have crashed before updating)
      if (emailLog.status === 'pending') {
        await updateEmailStatus(
          { jobId },
          {
            status: 'failed',
            error: failedReason || 'Job failed',
          }
        );
        logger.info(`Updated email log status to failed for job ${jobId}`);
      }
    }
  } catch (error) {
    logger.error(`Failed to update email log on job failure`, { jobId, error });
  }
});

mainQueueEvent.on('waiting', ({ jobId }) => {
  // Job is waiting in queue
  logger.info(`Job ${jobId} is waiting in queue`);
});

mainQueueEvent.on('completed', async ({ jobId, returnvalue }) => {
  logger.debug(`Job ${jobId} completed`, { returnvalue });

  // Update email log status if this is an email job and status is still pending
  try {
    const emailLog = await getEmailLog({ jobId });
    if (emailLog && EMAIL_JOB_TYPES.includes(emailLog.type)) {
      // Only update if status is still pending (shouldn't happen, but ensure consistency)
      if (emailLog.status === 'pending') {
        await updateEmailStatus(
          { jobId },
          {
            status: 'sent',
            sentAt: new Date(),
            error: null, // Clear error field when email is sent successfully
          }
        );
        logger.info(`Updated email log status to sent for job ${jobId} (fallback)`);
      }
    }
  } catch (error) {
    logger.error(`Failed to update email log on job completion`, { jobId, error });
  }
});

export { mainQueue, mainQueueEvent };
