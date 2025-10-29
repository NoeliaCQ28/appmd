import CellModel from "#models/cellModel.js";

const CellController = {
  getParams: async (req, res) => {
    const response = await CellModel.getParams();
    res.status(response.code).send(response);
  },

  getCells: async (req, res) => {
    const { brand, model, type } = req.body;
    const response = await CellModel.getCells({ brand, model, type });
    res.status(response.code).send(response);
  },
  getAllCells: async (req, res) => {
    const response = await CellModel.getAllCells();
    res.status(response.code).send(response);
  },

  create: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await CellModel.create(user_id, data);
    res.status(response.code).send(response);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const data = req.body;

    const response = await CellModel.update(id, user_id, data);
    res.status(response.code).send(response);
  },

  delete: async (req, res) => {
    const { id } = req.params;

    const response = await CellModel.delete(id);
    res.status(response.code).send(response);
  },

  getAllAccessorios: async (req, res) => {
    const response = await CellModel.getAllAccesorios();
    res.status(response.code).send(response);
  },

  createAccesorio: async (req, res) => {
    const data = req.body;
    const user_id = req.user.id;

    const response = await CellModel.createAccesorio(user_id, data);
    res.status(response.code).send(response);
  },

  updateAccesorio: async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const data = req.body;

    const response = await CellModel.updateAccesorio(id, user_id, data);
    res.status(response.code).send(response);
  },

  deleteAccesorio: async (req, res) => {
    const { id } = req.params;

    const user_id = req.user.id;

    const response = await CellModel.deleteAccesorio(id, user_id);
    res.status(response.code).send(response);
  },
};

export default CellController;
