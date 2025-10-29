import { logger } from "#libs/logger.js";
import MarginModel from "#models/v2/MarginModel.js";

export const MarginController = {
  find: async (req, res) => {
    const user_id = req.user.id;

    logger.info(`User ${user_id} requested all margins`);

    const { generatorSetId = 0, motorBrandId = 0, marketId = 0 } = req.query;

    const response = await MarginModel.find({
      generatorSetId,
      motorBrandId,
      marketId,
    });

    return res.status(response.code).json(response);
  },
};

export default MarginController;
