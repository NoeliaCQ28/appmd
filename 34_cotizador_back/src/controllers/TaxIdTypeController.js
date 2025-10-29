import TaxIdTypeModel from "#models/taxIdTypeModel.js";

const TaxIdTypeController = {
  getAll: async (req, res) => {
    const response = await TaxIdTypeModel.getAll();
    res.status(response.code).send(response);
  },
};

export default TaxIdTypeController;
