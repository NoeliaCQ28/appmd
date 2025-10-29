import TransformerModel from "#models/transformerModel.js";

const TransformerController = {
  getParams: async (req, res) => {
    const response = await TransformerModel.getParams();
    res.status(response.code).send(response);
  },

  getTransformers: async (req, res) => {
    const { brand, type } = req.body;
    const response = await TransformerModel.getTransformers({ brand, type });
    res.status(response.code).send(response);
  },
  getAllTransformers: async (req, res) => {
    const response = await TransformerModel.getAllTransformers();
    res.status(response.code).send(response);
  },

  getAllAccesorios: async (req, res) => {
    const response = await TransformerModel.getAllAccesorios();
    res.status(response.code).send(response);
  },

  createAccesorio: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await TransformerModel.createAccesorio(user_id, data);
    res.status(response.code).send(response);
  },

  updateAccesorio: async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const data = req.body;

    const response = await TransformerModel.updateAccesorio(id, user_id, data);
    res.status(response.code).send(response);
  },

  deleteAccesorio: async (req, res) => {
    const { id } = req.params;

    const user_id = req.user.id;

    const response = await TransformerModel.deleteAccesorio(id, user_id);
    res.status(response.code).send(response);
  },

  create: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await TransformerModel.create(user_id, data);
    res.status(response.code).send(response);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const data = req.body;

    const response = await TransformerModel.update(id, user_id, data);
    res.status(response.code).send(response);
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const response = await TransformerModel.delete(id);
    res.status(response.code).send(response);
  },
};

export default TransformerController;
