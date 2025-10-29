import SocietyModel from "#models/societyModel.js";

const SocietyController = {
  getAll: async (req, res) => {
    const response = await SocietyModel.getAll();
    res.status(response.code).send(response);
  },
};

export default SocietyController;
