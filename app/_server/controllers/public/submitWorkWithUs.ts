import { z } from 'zod';
import { sendResponse } from '../../lib/utils/appResponse';
import { createFormSubmission } from '../../lib/firestore/collections';
import type { RouteHandler } from '../../lib/api/routeHandler';
import { validateBody } from '../../lib/api/validateBody';
import { notifyFormSubmission } from '../../lib/email/formNotifications';
import { logger } from '../../lib/utils/logger';
import {
  assertPublicFormRateLimit,
  getClientIpForRateLimit,
} from '../../lib/utils/publicFormRateLimit';

const workWithUsSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  portfolio: z.url('Please enter a valid portfolio URL'),
  experience: z.string().min(1, 'Please select your experience level'),
  message: z.string().min(10, 'Please tell us more about yourself (at least 10 characters)'),
});

export const submitWorkWithUs: RouteHandler = async ({ body, request }) => {
  const ip = getClientIpForRateLimit(request);
  assertPublicFormRateLimit(ip, 'work-with-us');

  const payload = validateBody(workWithUsSchema, body ?? {});

  await createFormSubmission({
    formType: 'work-with-us',
    ...payload,
    sourceIp: ip === 'unknown' ? null : ip,
  });

  logger.info('Public form: work-with-us stored', {
    formType: 'work-with-us',
    sourceIp: ip === 'unknown' ? undefined : ip,
  });

  void notifyFormSubmission({
    formLabel: 'Work with us application',
    fields: {
      Name: payload.name,
      Email: payload.email,
      Portfolio: payload.portfolio,
      Experience: payload.experience,
      Message: payload.message,
    },
  }).catch(err => logger.error('Work-with-us notification email failed', { err }));

  return sendResponse(201, { ok: true }, 'Application received');
};
