import { CustomerSAPModel } from "./../models/CustomerSAPModel.js";

export const CustomerSAPController = {
  find: async (req, res) => {
    const { ruc, code } = req.query;
    let response = null;

    if (ruc) {
      response = await CustomerSAPModel.getByRuc({ ruc });
    } else if (code) {
      response = await CustomerSAPModel.getByCode({ code });
    } else {
      return res.status(400).send({
        code: 400,
        message: "Debe enviar un RUC o un código",
        success: false,
      });
    }

    res.status(response.code).send(response);
  },
  getByRuc: async (req, res) => {
    const { ruc } = req.query;
    const response = await CustomerSAPModel.getByRuc({ ruc });
    res.status(response.code).send(response);
  },

  getByCode: async (req, res) => {
    const { code } = req.query;
    const response = await CustomerSAPModel.getByCode({ code });
    res.status(response.code).send(response);
  },
  createFromModel: async (req, res) => {
    const { customerId } = req.params;

    const response = await CustomerSAPModel.createFromModel({ customerId });
    res.status(response.code).send(response);
  },
};
