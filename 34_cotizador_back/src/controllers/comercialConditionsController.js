import ComercialConditionsModel from "../models/comercialConditionsModel.js";

const ComercialConditionsController = {
  getAll: async (req, res) => {
    const response = await ComercialConditionsModel.getAll();
    res.status(response.code).send(response);
  },
  create: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await ComercialConditionsModel.create(user_id, data);
    res.status(response.code).send(response);
  },
  update: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const response = await ComercialConditionsModel.update(user_id, id, data);
    res.status(response.code).send(response);
  },
  delete: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const response = await ComercialConditionsModel.delete(user_id, id);
    res.status(response.code).send(response);
  },
};

export default ComercialConditionsController;
