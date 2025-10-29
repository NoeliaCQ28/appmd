import TaxClassModel from "#models/taxClassModel.js";

const TaxClassController = {
  getAll: async (req, res) => {
    const response = await TaxClassModel.getAll();
    res.status(response.code).send(response);
  },
};

export default TaxClassController;
