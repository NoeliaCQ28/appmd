import { allUsers } from "#models/userModel.js";
const UserController = {
  getAll: async (req, res) => {
    const response = await allUsers();

    res.status(response.code).send(response);
  },
};

export default UserController;
