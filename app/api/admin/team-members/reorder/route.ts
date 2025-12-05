import { reorderTeamMembers } from '@/app/_server/controllers/team-members/reorderTeamMembers';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const PATCH = applyMiddlewares(reorderTeamMembers);
