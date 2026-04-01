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

const quoteRequestSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  company: z.string().min(1, 'Company name is required'),
  email: z.email('Please enter a valid email address'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z
    .string()
    .min(10, 'Please provide more details about your project (at least 10 characters)'),
});

export const submitQuoteRequest: RouteHandler = async ({ body, request }) => {
  const ip = getClientIpForRateLimit(request);
  assertPublicFormRateLimit(ip, 'quote-request');

  const payload = validateBody(quoteRequestSchema, body ?? {});

  await createFormSubmission({
    formType: 'quote-request',
    ...payload,
    sourceIp: ip === 'unknown' ? null : ip,
  });

  logger.info('Public form: quote-request stored', {
    formType: 'quote-request',
    sourceIp: ip === 'unknown' ? undefined : ip,
  });

  void notifyFormSubmission({
    formLabel: 'Quote request',
    fields: {
      Name: payload.name,
      Company: payload.company,
      Email: payload.email,
      'Project type': payload.projectType,
      Budget: payload.budget,
      Message: payload.message,
    },
  }).catch(err => logger.error('Quote request notification email failed', { err }));

  return sendResponse(201, { ok: true }, 'Quote request received');
};
