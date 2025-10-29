import { MaterialSAPModel } from "../models/MaterialSAPModel";

export const MaterialSAPController = {
  getStock: async (req, res) => {
    const { matnr, werks } = req.query;

    if (!matnr || !werks) {
      return res.status(400).send({
        code: 400,
        message: "Debe enviar los parametros matnr y werks",
        success: false,
      });
    }

    const response = await MaterialSAPModel.getStock({ matnr, werks });

    res.status(response.code).send(response);
  },
};
