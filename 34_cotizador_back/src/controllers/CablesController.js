import CablesModel from "#models/CablesModel.js";

const CablesController = {
  getParams: async (req, res) => {
    const response = await CablesModel.getParams();
    res.status(response.code).send(response);
  },

  getCables: async (req, res) => {
    const { brand, type } = req.body;
    const response = await CablesModel.getCables({ brand, type });
    res.status(response.code).send(response);
  },

  getAll: async (req, res) => {
    const response = await CablesModel.getAll();
    res.status(response.code).send(response);
  },

  create: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await CablesModel.create(user_id, data);
    res.status(response.code).send(response);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const user_id = req.user.id;

    const response = await CablesModel.update(id, user_id, data);
    res.status(response.code).send(response);
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const response = await CablesModel.delete(id);
    res.status(response.code).send(response);
  },
};

export default CablesController;
