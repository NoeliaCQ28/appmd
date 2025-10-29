import QuoteDetailsModel from "../models/quoteDetailsModel.js";

const QuoteDetailsController = {
  getAllByQuoteId: async (req, res) => {
    const { id } = req.params;
    const response = await QuoteDetailsModel.getAllByQuoteId(id);
    res.status(response.code).send(response);
  },
  getIntegradora: async (req, res) => {
    const { id } = req.params;
    const response = await QuoteDetailsModel.getIntegradora(id);
    res.status(response.code).send(response);
  },
  delete: async (req, res) => {
    const user_id = req.user.id;
    const { id, detalle_id } = req.params;

    const response = await QuoteDetailsModel.delete(user_id, id, detalle_id);
    res.status(response.code).send(response);
  },
  update: async (req, res) => {
    const user_id = req.user.id;
    const { id, detalle_id } = req.params;
    const data = req.body;

    const response = await QuoteDetailsModel.update(
      user_id,
      id,
      detalle_id,
      data
    );
    res.status(response.code).send(response);
  },
  updateQuantity: async (req, res) => {
    const user_id = req.user.id;
    const { cotizacion_id } = req.params;
    const data = req.body;

    const response = await QuoteDetailsModel.UpdateQuantity(
      cotizacion_id,
      data
    );
    res.status(response.code).send(response);
  },
  getDetails: async (req, res) => {
    const user_id = req.user.id;
    const { id, detalle_id } = req.params;

    const response = await QuoteDetailsModel.getDetailItems(id, detalle_id);
    res.status(response.code).send(response);
  },
  addItemsDetails: async (req, res) => {
    const user_id = req.user.id;
    const { quote_id } = req.params;
    const data = req.body;

    const response = await QuoteDetailsModel.AddItemsDetails(
      user_id,
      quote_id,
      data
    );
    res.status(response.code).send(response);
  },
  addDetails: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const { attachDetailsToQuote } = QuoteDetailsModel;

    const response = await attachDetailsToQuote(user_id, id, data?.details);
    res.status(response.code).send(response);
  },
};

export default QuoteDetailsController;
