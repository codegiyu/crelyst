import { addHours } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';
import { ENVIRONMENT } from '../config/environment';
import { setCookie } from './helpers';
import { NextRequest } from 'next/server';
import { ACCESS_TYPES, AuthUserRole, ModelAdmin, ModelUser } from '../types/constants';
import { ADMIN_OR_CUSTOMER } from '../../middlewares/protectRoutes';
import { Model } from 'mongoose';

const nigeriaTimeZone = 'Africa/Lagos';

export const expirationDate = (hour: number) =>
  toZonedTime(addHours(new Date().toISOString(), hour), nigeriaTimeZone);

export const isPostman = (req: NextRequest) => {
  return req.headers.get('user-agent')?.includes('Postman');
};

export interface ITokenPayload extends JwtPayload {
  id: string;
  roles: AuthUserRole[];
  jti: string;
  permissions: string[];
  scope: ACCESS_TYPES;
}

export interface IOTPPayload extends JwtPayload {
  code: string;
  email?: string;
}

// Synchronously create token
export const createToken = (
  data: ITokenPayload | IOTPPayload,
  options?: SignOptions,
  secret?: string
) => {
  return jwt.sign(data, secret ? secret : ENVIRONMENT.JWT.ACCESS_TOKEN_SECRET, {
    ...options,
    expiresIn:
      options?.expiresIn || (ENVIRONMENT.JWT.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn']),
  });
};

// Asynchronously verify given token
export const verifyToken = async (token: string, secret?: string) => {
  const verifyAsync: (arg1: string, arg2: string) => jwt.JwtPayload = promisify(jwt.verify);
  return verifyAsync(token, secret ? secret : ENVIRONMENT.JWT.ACCESS_TOKEN_SECRET!).catch(
    (_err: unknown) => null
  );
};

export const createAuthTokens = async (
  req: NextRequest,
  user: ModelUser | ModelAdmin,
  accessType: ACCESS_TYPES,
  JTI: string
) => {
  const accessToken = createToken(
    {
      id: user._id,
      email: user.email,
      roles: user.auth.roles,
      jti: JTI,
      permissions: [], // Update when permissions are introduced
      scope: `${accessType}-access`,
      code: '',
    },
    { expiresIn: ENVIRONMENT.JWT.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'] },
    ENVIRONMENT.JWT.ACCESS_TOKEN_SECRET
  );

  const refreshToken = createToken(
    {
      id: user._id,
      email: user.email,
      roles: user.auth.roles,
      jti: JTI,
      code: '',
      permissions: [],
      scope: `${accessType}-access`,
    },
    { expiresIn: ENVIRONMENT.JWT.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'] },
    ENVIRONMENT.JWT.REFRESH_TOKEN_SECRET
  );

  setCookie(req, ENVIRONMENT.TOKEN_NAMES.COOKIES.ACCESS, accessToken, {
    expires: expirationDate(ENVIRONMENT.COOKIE.ACCESS_COOKIE_EXPIRES_IN),
  });

  setCookie(req, ENVIRONMENT.TOKEN_NAMES.COOKIES.REFRESH, refreshToken, {
    expires: expirationDate(ENVIRONMENT.COOKIE.REFRESH_COOKIE_EXPIRES_IN),
  });

  // res.setHeader(
  //   'x-auth-expires-in',
  //   subMinutes(expirationDate(ENVIRONMENT.COOKIE.REFRESH_COOKIE_EXPIRES_IN), 10).toISOString()
  // );

  return JTI;
};

export const clearAuthTokens = async (
  req: NextRequest,
  user: ModelUser | ModelAdmin,
  accessType: ACCESS_TYPES
) => {
  setCookie(req, ENVIRONMENT.TOKEN_NAMES.COOKIES.REFRESH, '', {
    maxAge: -1,
  });

  setCookie(req, ENVIRONMENT.TOKEN_NAMES.COOKIES.ACCESS, '', {
    maxAge: -1,
  });

  // res.setHeader(
  //   'x-auth-expires-in',
  //   toZonedTime(subMinutes(new Date(), 5), nigeriaTimeZone).toISOString()
  // );

  const userToUpdate = await (
    ADMIN_OR_CUSTOMER[accessType] as Model<ModelUser | ModelAdmin>
  ).findByIdAndUpdate(
    user._id,
    {
      'auth.refreshTokenJTI': '',
    },
    {
      new: true,
    }
  );

  if (!userToUpdate) return false;

  // await removeFromCache(`vol:${userToUpdate?.email}`);

  return true;
};
