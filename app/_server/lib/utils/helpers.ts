/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { customAlphabet } from 'nanoid';
import { logger } from './logger';

export const isPostman = (req: NextRequest) => {
  return req.headers.get('user-agent')?.includes('Postman');
};

export const generateRandomString = (length: number, prefix?: string): string => {
  const nanoid = customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ',
    length
  );
  return prefix ? `${prefix}-${nanoid()}` : nanoid();
};

export const generateRandomNumber = (length: number): string => {
  const nanoid = customAlphabet('1234567890', length);
  return nanoid();
};

export const createBcryptHash = async (password: string | Buffer) => {
  return await bcrypt.hash(password, 10).catch(() => 'Error creating hash');
};

export const compareBcryptHash = async (password: string | Buffer, hash: string) => {
  return await bcrypt.compare(password, hash).catch(() => 'Error comparing hash');
};

type CookieSetOptions = Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2];

export const setCookie = async (
  req: NextRequest,
  name: string,
  value: string,
  options: CookieSetOptions = {}
) => {
  const cookieStore = await cookies();
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: !isPostman(req),
    path: '/',
    sameSite: 'none',
    partitioned: true,
    ...options,
  });
};

export const generateCacheKey = (query: Record<string, any>): string => {
  const ParsedQs = JSON.stringify(query);
  return crypto.createHash('md5').update(ParsedQs).digest('hex');
};

export const sendPushNotification = async (
  token: string,

  message: string,

  payload?: object,

  title?: string
) => {
  try {
    if (!token) {
      logger.debug('Push notification token not found');
      return;
    }

    if (token === undefined || token === '') {
      logger.debug('Invalid push notification token');
      return;
    }
  } catch (error) {
    logger.error('Error sending push notification:', error);
  }
};

export const monitoringAlert = async (message: string, sendToAdmins?: boolean | 'dev') => {
  logger.warn('Monitoring alert', { message, sendToAdmins });
};

export const assertENV = (variable: string | undefined, options?: { message: string }) => {
  const { message = 'Required Environment variable is missing or undefined' } = options ?? {};

  if (!variable) {
    throw new Error(message);
  }

  return variable;
};
