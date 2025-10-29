import RolesModel from "#models/rolesModel.js";

const RolesController = {
  getAll: async (req, res) => {
    const response = await RolesModel.getAll();

    res.status(response.code).send(response);
  },
};

export default RolesController;
