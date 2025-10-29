import MarketsModel from "#models/marketsModel.js";

const MarketController = {
  getAll: async (req, res) => {
    const response = await MarketsModel.getAll();

    res.status(response.code).send(response);
  },
};

export default MarketController;
