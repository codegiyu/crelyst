import { listTeamMembers } from '@/app/_server/controllers/team-members/listTeamMembers';
import { createTeamMember } from '@/app/_server/controllers/team-members/createTeamMember';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(listTeamMembers('console'));
export const POST = applyMiddlewares(createTeamMember);
