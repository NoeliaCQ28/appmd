import PaymentConditionsModel from "#models/paymentConditionsModel.js";

const PaymentConditionsController = {
  getAll: async (req, res) => {
    const response = await PaymentConditionsModel.getAll();
    res.status(response.code).send(response);
  },
};

export default PaymentConditionsController;
