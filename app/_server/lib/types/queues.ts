import { CompanyKey } from './constants';

interface BaseJobData {
  type: JOB_TYPE;
  priority?: number;
  delay?: number;
  code?: string;
  link?: string;
  avatar?: string;
}

interface BaseEmailJobData extends BaseJobData {
  from?: string;
  to: string;
  name?: string;
  company?: CompanyKey;
}

export interface OTPJobData extends BaseEmailJobData {
  code: string;
  avatar?: string;
}

export interface ResetPasswordJobData extends BaseEmailJobData {
  link: string;
}

export interface InviteAdminJobData extends BaseEmailJobData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];
  token: string;
  inviteLink: string;
}

export interface NotificationEmailJobData extends BaseEmailJobData {
  title: string;
  message: string;
  eventType?: string;
  notificationId?: string;
  userModel: 'User' | 'Admin';
  subject?: string;
}

export interface DeleteFileJobData extends BaseJobData {
  userId?: string;
  intent?: string;
  filename: string;
}

export type PushJobData = BaseJobData;

export type processBugProcessingJobData = BaseJobData;

export interface processBroadcastJOBData extends BaseJobData {
  image: string;
  screen: string;
  button: string;
  message: string;
  title: string;
  body: string;
  customerId: string;
  isBroadcast: boolean;
  displayMode: string;
  createdAt: string;
  expiresAt: string;
  scheduled: boolean;
}

export type processTransactionMigration = BaseJobData;

export type processUserMigration = BaseJobData;

export type dailyBackup = BaseJobData;

export type JobData =
  | OTPJobData
  | ResetPasswordJobData
  | InviteAdminJobData
  | NotificationEmailJobData
  | DeleteFileJobData
  | PushJobData
  | processBugProcessingJobData
  | processBroadcastJOBData
  | processTransactionMigration
  | processUserMigration
  | dailyBackup;

export const JOB_TYPES = [
  'deleteFile',
  'inviteAdmin',
  'resetPassword',
  'verificationCode',
  'notificationEmail',
  'processPushNotifications',
  'processBugProcessing',
  'processBroadcastNotifications',
  'processMigrations',
  'processUserMigration',
  'processTransactionMigration',
  'dailyBackup',
] as const;

export type JOB_TYPE = (typeof JOB_TYPES)[number];
