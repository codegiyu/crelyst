import { getTeamMember } from '@/app/_server/controllers/team-members/getTeamMember';
import { updateTeamMember } from '@/app/_server/controllers/team-members/updateTeamMember';
import { deleteTeamMember } from '@/app/_server/controllers/team-members/deleteTeamMember';
import { applyMiddlewares } from '@/app/_server/middlewares/applyMiddlewares';

export const GET = applyMiddlewares(getTeamMember);
export const PATCH = applyMiddlewares(updateTeamMember);
export const DELETE = applyMiddlewares(deleteTeamMember);
