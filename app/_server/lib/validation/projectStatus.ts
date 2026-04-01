import { z } from 'zod';
import { PROJECT_STATUSES } from '../types/constants';

const statusTuple = PROJECT_STATUSES as unknown as [string, ...string[]];

export const projectStatusSchema = z.enum(statusTuple);
