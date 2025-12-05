import { Admin } from '../../models/admin';
import { AppError } from '../../lib/utils/appError';
import { compareBcryptHash, generateRandomString } from '../../lib/utils/helpers';
import { createAuthTokens } from '../../lib/utils/tokens';
import { deleteFields } from '../../middlewares/protectRoutes';
import { unselectedFields } from '../../models/user';
import { catchAsync } from '../../middlewares/catchAsync';
import { sendResponse } from '../../lib/utils/appResponse';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';

// Login controller (public endpoint)
export const login = withRequestContext({ protect: false })(
  catchAsync(async context => {
    const { req } = context as RequestContext;
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Find admin with password field included
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid =
      admin.auth?.password?.value && (await compareBcryptHash(password, admin.auth.password.value));

    if (!isPasswordValid || isPasswordValid === 'Error comparing hash') {
      throw new AppError('Invalid email or password', 401);
    }

    // Check account status
    if (admin.accountStatus === 'suspended') {
      throw new AppError('Your account has been suspended', 403);
    }

    if (admin.accountStatus === 'deleted') {
      throw new AppError('Account not found', 401);
    }

    // Generate JTI for tokens
    const JTI = await createAuthTokens(req, admin, 'console', generateRandomString(16, 'JTI'));

    // Update admin with new JTI and last login
    const updatedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      {
        'auth.refreshTokenJTI': JTI,
        'auth.lastLogin': new Date(),
      },
      { new: true }
    ).select(unselectedFields.join(' '));

    if (!updatedAdmin) {
      throw new AppError('Failed to sign in', 500);
    }

    // Remove sensitive fields before returning
    const sanitizedAdmin = await deleteFields(updatedAdmin, unselectedFields);

    return sendResponse(
      200,
      {
        admin: sanitizedAdmin,
      },
      'Login successful'
    );
  })
);
