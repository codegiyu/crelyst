import { listTeamMembers } from '@/app/_server/controllers/team-members/listTeamMembers';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listTeamMembers('client'));
