import { JOB_TYPE, JobData } from '../../lib/types/queues';
import { redisCache } from '../../lib/utils/redis';
import { Job, Worker, type WorkerOptions } from 'bullmq';
// Lazy-load sendEmail to avoid importing @react-email/render at module load time
// This prevents build-time errors with React 19 compatibility
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

// Lazy worker creation function to avoid build-time analysis
// Only create worker at runtime, not during Next.js build
let _mainWorker: Worker<JobData> | null = null;

function createWorker(): Worker<JobData> {
  if (_mainWorker) {
    return _mainWorker;
  }

  _mainWorker = new Worker<JobData>(
    'mainQueue',
    async (job: Job) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'workers/index.ts:30',
          message: 'Job processing started',
          data: {
            jobId: job.id,
            jobType: job.data?.type,
            jobDataKeys: job.data ? Object.keys(job.data) : [],
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'E',
        }),
      }).catch(() => {});
      // #endregion
      const type = job.data.type;

      switch (type as JOB_TYPE) {
        case 'verificationCode':
        case 'resetPassword':
        case 'notificationEmail':
        case 'inviteAdmin': {
          // Lazy-load sendEmail to avoid React 19 compatibility issues during build
          const { sendEmail } = await import('../handlers/sendEmail');
          return await sendEmail(job);
        }
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

  _mainWorker.on('error', err => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a9eb2e23-6629-45c9-a242-faa9256446d5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'workers/index.ts:91',
        message: 'Worker error handler',
        data: {
          errorMessage: err?.message,
          errorName: err?.name,
          errorString: String(err),
          errorStack: err?.stack?.substring(0, 500),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          hasVersion: !!(err as any)?.version,
          errorKeys: err ? Object.keys(err) : [],
          errorType: typeof err,
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'D',
      }),
    }).catch(() => {});
    // #endregion
    // log the error
    logger.error(`Error processing job: ${err}`);
  });

  return _mainWorker;
}

// Export getter function instead of direct worker instance
// This prevents Next.js from analyzing the worker during build
export function getMainWorker(): Worker<JobData> {
  return createWorker();
}

// For backward compatibility, export a getter that creates worker on first access
export const mainWorker = new Proxy({} as Worker<JobData>, {
  get(_target, prop) {
    const worker = createWorker();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (worker as any)[prop];
  },
});
