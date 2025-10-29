import OpcionalesModel from "../models/opcionalesModel.js";

const OpcionalesController = {
  getByIntegradoraId: async (req, res) => {
    const { integradoraId } = req.params;

    const response = await OpcionalesModel.getByIntegradoraId(integradoraId);
    res.status(response.code).send(response);
  },
  getAll: async (req, res) => {
    const response = await OpcionalesModel.getAll();
    res.status(response.code).send(response);
  },
  getById: async (req, res) => {
    const { id } = req.params;
    const response = await OpcionalesModel.getById({ id });
    res.status(response.code).send(response);
  },
  create: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await OpcionalesModel.create(user_id, data);
    res.status(response.code).send(response);
  },
  update: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;
    const { id } = req.params;

    const response = await OpcionalesModel.update(user_id, id, data);
    res.status(response.code).send(response);
  },
  delete: async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    const response = await OpcionalesModel.delete(user_id, id);
    res.status(response.code).send(response);
  },
  getAllBrands: async (req, res) => {
    const response = await OpcionalesModel.getAllBrands();
    res.status(response.code).send(response);
  },
  getAllTypes: async (req, res) => {
    const response = await OpcionalesModel.getAllTypes();
    res.status(response.code).send(response);
  },
};

export default OpcionalesController;
