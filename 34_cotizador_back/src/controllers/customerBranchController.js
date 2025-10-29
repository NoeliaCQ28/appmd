import CustomerBranchModel from "#models/customerBranchModel.js";

const CustomerBranchController = {
  getAll: async (req, res) => {
    const response = await CustomerBranchModel.getAll();
    res.status(response.code).send(response);
  },
};

export default CustomerBranchController;
