import { JOB_TYPE, JobData } from '../../lib/types/queues';
import { redisCache } from '../../lib/utils/redis';
import { Job, Worker, type WorkerOptions } from 'bullmq';
import { sendEmail } from '../handlers/sendEmail';
import { monitoringAlert } from '../../lib/utils/helpers';
import { logger } from '../../lib/utils/logger';

// define worker options
type MainWorkerOptions = WorkerOptions;

const mainWorkerOptions: MainWorkerOptions = {
  connection: redisCache,
  prefix: 'queue',
  limiter: { max: 5, duration: 1000 }, // process 1 job every second due to rate limiting of job sender
  lockDuration: 5000, // 5 seconds to process the job before it can be picked up by another worker
  removeOnComplete: {
    age: 3600, // keep up to 1 hour
    count: 1000, // keep up to 1000 jobs
  },
  removeOnFail: {
    age: 24 * 3600, // keep up to 24 hours
  },

  // concurrency: 5, // process 5 jobs concurrently
};

// create a worker to process jobs from the job queue
export const mainWorker = new Worker<JobData>(
  'mainQueue',
  async (job: Job) => {
    const type = job.data.type;

    switch (type as JOB_TYPE) {
      case 'verificationCode':
      case 'resetPassword':
      case 'notificationEmail':
      case 'inviteAdmin':
        return await sendEmail(job);
      // case 'processPushNotifications':
      //   return await processPushNotifications();
      // case 'processBroadcastNotifications': {
      //   if (job.data.scheduled === false) {
      //     monitoringAlert('Broadcast notification processing');
      //     return await sendBroadcastNotification(job.data);
      //   } else {
      //     monitoringAlert('Scheduled broadcast notification  processing');

      //     await mainQueue.removeJobScheduler('processBroadcastNotifications');
      //     const repeatedJob = await mainQueue.upsertJobScheduler(
      //       'processBroadcastNotifications',
      //       {
      //         every: 10000,
      //         immediately: true,
      //       },
      //       {
      //         name: 'processBroadcastNotifications',
      //         data: {
      //           type: 'processBroadcastNotifications',
      //           ...job.data,
      //           scheduled: false,
      //         },
      //       }
      //     );
      //     logger.info('broadcast notifications Job added', repeatedJob.id);
      //     return true;
      //   }
      // }
      case 'processUserMigration':
        // return await writeUsers();
        return true;
      // case 'processTransactionMigration':
      //   // return await writeTransaction();
      //   return true;
      case 'processTransactionMigration':
        // return await writeBVN();
        return true;
      case 'dailyBackup':
        // return await backupMongoDB();
        return true;
      // case 'deleteFile':
      //   return await deleteFileFromBucket(job.data);

      default:
        monitoringAlert(`Unknown job type: ${type}`);
        logger.error(`Unknown job type: ${type}`);
    }
  },
  mainWorkerOptions
);

mainWorker.on('error', err => {
  // log the error
  logger.error(`Error processing job: ${err}`);
});
