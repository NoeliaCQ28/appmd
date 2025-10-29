import { QuoteValidateSAPModel } from "../models/QuoteValidateSAPModel.js";

export const QuoteValidateSAPController = {
  validate: async (req, res) => {
    const quote = req.body;

    if (!quote || Object.keys(quote).length === 0) {
      return res.status(400).send({
        code: 400,
        message: "La cotización es requerida",
        success: false,
      });
    }

    const response = await QuoteValidateSAPModel.validate({ quote });

    res.status(response.code).send(response);
  },
};
