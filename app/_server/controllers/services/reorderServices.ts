import { AppError } from '../../lib/utils/appError';
import { sendResponse } from '../../lib/utils/appResponse';
import { catchAsync } from '../../middlewares/catchAsync';
import { Service } from '../../models/service';
import { RequestContext, withRequestContext } from '../../lib/context/withRequestContext';
import mongoose from 'mongoose';

interface ReorderItem {
  id: string;
  displayOrder: number;
}

// Bulk update display orders for services (admin only)
export const reorderServices = withRequestContext({ protect: true, accessType: 'console' })(
  catchAsync(async context => {
    const { body, user } = context as RequestContext;

    if (!user || !user._id) {
      throw new AppError('Unauthorized', 401);
    }

    const { reorderItems } = body as { reorderItems: ReorderItem[] };

    if (!reorderItems || !Array.isArray(reorderItems)) {
      throw new AppError('reorderItems array is required', 400);
    }

    if (reorderItems.length === 0) {
      throw new AppError('reorderItems array cannot be empty', 400);
    }

    // Validate all items have required fields
    for (const item of reorderItems) {
      if (!item.id) {
        throw new AppError('Each item must have an id', 400);
      }
      if (typeof item.displayOrder !== 'number' || item.displayOrder < 0) {
        throw new AppError('Each item must have a valid displayOrder (non-negative number)', 400);
      }
      if (!mongoose.Types.ObjectId.isValid(item.id)) {
        throw new AppError(`Invalid service id: ${item.id}`, 400);
      }
    }

    // Use bulkWrite for efficient batch update
    const bulkOps = reorderItems.map(item => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id) },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    const result = await Service.bulkWrite(bulkOps);

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      throw new AppError('No services were found to update', 404);
    }

    return sendResponse(
      200,
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      'Services reordered successfully'
    );
  })
);
