// import cookie from 'cookie';
import { isBefore, parseISO } from 'date-fns';
// import { toZonedTime } from 'date-fns-tz';
import type { JwtPayload } from 'jsonwebtoken';
// import { merge } from 'lodash';
import type { Model } from 'mongoose';
import { AppError } from '../lib/utils/appError';
import { ENVIRONMENT } from '../lib/config/environment';
import { createAuthTokens, verifyToken } from '../lib/utils/tokens';
import { generateRandomString } from '../lib/utils/helpers';
import { catchAsync } from './catchAsync';
import { ACCESS_TYPES, ModelAdmin, ModelUser } from '../lib/types/constants';
import { unselectedFields, User } from '../models/user';
import { Admin } from '../models/admin';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
// import type { Mode } from 'fs';

// type ModelUserModel = Model<ModelUser>;

export const ADMIN_OR_CUSTOMER: {
  [key in ACCESS_TYPES]: Model<ModelUser> | Model<ModelAdmin>;
} = {
  client: User,
  console: Admin,
};

// remove sensitive data
export const deleteFields = async (user: ModelUser | ModelAdmin, fields: string[]) => {
  const obj = JSON.parse(JSON.stringify(user));
  for (const field of fields) {
    const newFields = field.replace('+', '').split('.');

    try {
      let temp = obj;
      for (let i = 0; i < newFields.length - 1; i++) {
        temp = newFields[i] !== undefined && temp[newFields[i] as string];
      }
      delete temp[newFields[newFields.length - 1] as string];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e: unknown) {
      console.log(`Field '${field}' or its parent does not exist`);
    }
  }
  return obj;
};

// fetch user from db and cache it
export const fetchUser = async (email: string, accessType: ACCESS_TYPES, full: boolean = false) => {
  let user = null;

  // // fetch user from cache
  // user = await getFromCache<ModelUser | ModelAdmin>(`vol:${email.toLowerCase()}`);

  // // ensure a customer with same email does not have admin roles
  // if (
  //   (accessType === 'client' || accessType === 'specialist') &&
  //   user?.auth?.roles &&
  //   user.auth.roles.filter(s => s.slug.includes('admin')).length > 0
  // )
  //   user = null;

  // if (user)
  //   // return user if found in cache
  //   return user;

  // fetch user from db if not found in cache
  const fetchedUser = await (ADMIN_OR_CUSTOMER[accessType] as Model<ModelUser | ModelAdmin>)
    .findOne({ email: email.toLowerCase() })
    .select(unselectedFields.join(' '))
    .lean();

  if (!fetchedUser) return null;

  user = fetchedUser;

  // cache user
  // await addToCache(`vol:${email}`, user);

  // if full is not true, remove sensitive data
  if (!full) user = await deleteFields(user as unknown as ModelUser | ModelAdmin, unselectedFields);
  return user;
};

// export const updateCachedUser = async (user: BaseUser) => {
//   const cachedUser = await getFromCache<ModelUser>(`vol:${user?.email}`);
//   if (!cachedUser || !user?.email) return true;

//   console.log('Updating cached user', user?.email);
//   await addToCache(`vol:${user?.email}`, merge({}, cachedUser, user));

//   return true;
// };

const checkAccountStatus = async (user: ModelUser, accessType: ACCESS_TYPES) => {
  if (user.accountStatus === 'suspended') {
    throw new AppError(`UAS: ${accessType} access has been suspended`, 426);
  }
  if (user.accountStatus === 'deleted') {
    throw new AppError(`ANF: ${accessType} account not found!`, 401);
  }
  if (
    !user.auth.roles.find(
      role =>
        role.slug === accessType ||
        (accessType === 'console' && ['super-admin', 'admin'].includes(role.slug))
    )
  ) {
    throw new AppError(`ANFR: ${accessType} account not found!`, 401);
  }
};

const checkTokenValidity = async (decodedPayload: JwtPayload, user: ModelUser) => {
  if (decodedPayload.jti !== user.auth.refreshTokenJTI) {
    throw new AppError('TJI: Unauthenticated', 401);
  }
};

const checkTokenScope = async (decodedPayload: JwtPayload, accessType: ACCESS_TYPES) => {
  if (decodedPayload.scope !== `${accessType}-access`) {
    throw new AppError(`TNV: Token is not valid for ${accessType} scope`, 401);
  }
};

const checkPasswordChange = async (decodedPayload: JwtPayload, user: ModelUser) => {
  const iatDate = new Date(decodedPayload.iat! * 1000).toISOString();

  if (
    user.auth?.password &&
    user.auth?.password?.passwordChangedAt &&
    isBefore(iatDate, parseISO(user.auth.password.passwordChangedAt.toString()))
  ) {
    throw new AppError('Password change detected. Please log in again!', 401);
  }
};

// const checkIdleTime = async (user: ModelUser) => {
//   const lastActivity = await getFromCache(`pers:${user.email}:lastActivity`);

//   if (
//     lastActivity &&
//     isAfter(parseISO(lastActivity.toString()), new Date(Date.now() - 30 * 60)) // 30 minutes
//   ) {
//     throw new AppError('ITD: Inactivity detected, Please re-verify your 2FA', 403);
//   }
// };

export const protectRoutes = (accessType: ACCESS_TYPES) =>
  catchAsync(async req => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ENVIRONMENT.TOKEN_NAMES.COOKIES.ACCESS)?.value ?? '';
    const refreshToken = cookieStore.get(ENVIRONMENT.TOKEN_NAMES.COOKIES.REFRESH)?.value ?? '';

    if (!refreshToken) throw new AppError('NRT: Unauthenticated', 401);

    let decodedPayload: JwtPayload;

    const decodedRefresh = await verifyToken(refreshToken, ENVIRONMENT.JWT.REFRESH_TOKEN_SECRET);

    if (!decodedRefresh) throw new AppError('RTDE: Unauthenticated', 401);

    const decodedAccess = await verifyToken(accessToken, ENVIRONMENT.JWT.ACCESS_TOKEN_SECRET);

    // eslint-disable-next-line prefer-const
    decodedPayload = decodedAccess || decodedRefresh;

    const user = await fetchUser(decodedPayload.email, accessType, true);

    if (!user) throw new AppError(`${accessType} account not found!`, 401);

    await checkAccountStatus(user, accessType);
    await checkTokenValidity(decodedPayload, user);
    await checkTokenScope(decodedPayload, accessType);
    await checkPasswordChange(decodedPayload, user);

    // if (accessType === 'admin') {
    //   await checkIdleTime(user);
    // }

    // res.setHeader(
    //   'x-auth-expires-in',
    //   toZonedTime(addMinutes(decodedRefresh.exp! * 1000, 1), 'Africa/Lagos').toISOString()
    // );

    if (!decodedAccess) {
      const JTI = await createAuthTokens(
        req as NextRequest,
        user,
        accessType,
        generateRandomString(16, 'JTI')
      );

      const updatedCustomer = await (ADMIN_OR_CUSTOMER[accessType] as Model<ModelUser>)
        .findByIdAndUpdate(
          user._id,
          {
            'auth.refreshTokenJTI': JTI,
          },
          { new: true }
        )
        .lean();

      if (!updatedCustomer)
        throw new AppError('Unable to auto extend session, please log in again', 401);

      // await removeFromCache(`vol:${updatedCustomer.email}`);

      // Log the header value to ensure it is set correctly
      console.log('AUTH SESSION EXTENDED AUTOMATICALLY');
    }

    // req.headers['x-token-created'] = new Date(decodedPayload.iat! * 1000).toISOString();

    return user;
  });
