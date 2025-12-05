import { withRequestContext } from '../../lib/context/withRequestContext';
import { sendResponse } from '../../lib/utils/appResponse';

export const getSiteSettings = withRequestContext({})(async () => {
  return sendResponse(200, {}, 'Site settings fetched successfully');
});
