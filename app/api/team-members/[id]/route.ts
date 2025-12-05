import { getTeamMember } from '@/app/_server/controllers/team-members/getTeamMember';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getTeamMember);
