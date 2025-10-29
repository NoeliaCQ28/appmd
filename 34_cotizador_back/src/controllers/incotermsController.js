import IncotermsModel from "#models/incotermsModel.js";

const IncotermsController = {
  getAll: async (req, res) => {
    const response = await IncotermsModel.getAll();

    res.status(response.code).send(response);
  },
};

export default IncotermsController;
