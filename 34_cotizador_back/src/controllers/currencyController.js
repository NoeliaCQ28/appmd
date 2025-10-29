import CurrencyModel from "../models/currencyModel.js";

const CurrencyController = {
  getAll: async (req, res) => {
    const response = await CurrencyModel.getAll();
    res.status(response.code).send(response);
  },
};

export default CurrencyController;
