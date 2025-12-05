/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { isPostman } from './tokens';
import { AppError } from './appError';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import type { CookieOptions } from 'express';
import { customAlphabet } from 'nanoid';
import { RoleSlug } from '../seed';
import { Role } from '../../models/role';
import { CacheKey, getFromCacheOrDB, redisCache } from './redis';
import { logger } from './logger';
import { IRole } from '../types/constants';

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

export const setCookie = async (
  req: NextRequest,
  name: string,
  value: string,
  options: CookieOptions = {}
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

    // if (token && token.length > 1 && token?.includes('ExponentPushToken')) {
    //   return redisCache
    //     .rpush(
    //       'pers:ihp:push:notifications',
    //       JSON.stringify({
    //         to: token,
    //         sound: 'default',
    //         title: title || 'ZedApp',
    //         body: message,
    //         data: payload || {},
    //       })
    //     )
    //     .catch((err: unknown) => {
    //       console.error('Error sending push notification:', err);
    //     });
    // }
  } catch (error) {
    logger.error('Error sending push notification:', error);
  }
};

export const monitoringAlert = async (message: string, sendToAdmins?: boolean | 'dev') => {
  const tokens: CacheKey[] = [];

  switch (sendToAdmins) {
    case 'dev':
      tokens.push('pers:dev:token');
      break;
    case true:
      tokens.push('pers:dev:token');
      break;
    default:
      logger.warn(`No case for sendToAdmins: ${sendToAdmins}`);
  }

  logger.info('Monitoring alert:', { message });

  for (const token of tokens) {
    const pushToken = await redisCache.get(token);
    await sendPushNotification(pushToken as string, message);
  }
};

export const assertENV = (variable: string | undefined, options?: { message: string }) => {
  const { message = 'Required Environment variable is missing or undefined' } = options ?? {};

  if (!variable) {
    throw new Error(message);
  }

  return variable;
};

export const getRoleWithSlug = async (roleSlug: RoleSlug) => {
  const roleObj = await getFromCacheOrDB(`pers:roleKeys:${roleSlug}`, async () => {
    const role = await Role.findOne({ slug: roleSlug }).lean<IRole>();

    if (!role) throw new AppError('RNF: Role not found', 500);

    return role;
  });

  return roleObj;
};
