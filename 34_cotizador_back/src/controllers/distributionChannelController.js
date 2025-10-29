import DistributionChannelModel from "#models/distributionChannelModel.js";

const DistributionChannelController = {
  getAll: async (req, res) => {
    const response = await DistributionChannelModel.getAll();

    res.status(response.code).send(response);
  },
};

export default DistributionChannelController;
