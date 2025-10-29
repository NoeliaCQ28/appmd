import QuoteModel from "../models/quoteModel.js";

const QuoteController = {
  getAllQuoteTypes: async (req, res) => {
    const response = await QuoteModel.getAllQuoteTypes();

    res.status(response.code).send(response);
  },
  getAll: async (req, res) => {
    const { onlyOrders } = req.query;
    const response =
      onlyOrders === "true"
        ? await QuoteModel.getAllOrdersOnly()
        : await QuoteModel.getAll();

    res.status(response.code).send(response);
  },
  getById: async (req, res) => {
    const { id } = req.params;

    const response = await QuoteModel.getById(id);
    res.status(response.code).send(response);
  },
  create: async (req, res) => {
    const user_id = req.user.id;
    const data = req.body;

    const response = await QuoteModel.create(user_id, data);
    res.status(response.code).send(response);
  },
  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const response = await QuoteModel.update(req.ctx, id, data);
    res.status(response.code).send(response);
  },
  updateState: async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const response = await QuoteModel.updateState(req.ctx, id, data);
    res.status(response.code).send(response);
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const response = await QuoteModel.delete(req.ctx, id);
    res.status(response.code).send(response);
  },
  validateQuote: async (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    const response = await QuoteModel.validateQuote(user_id, id);
    res.status(response.code).send(response);
  },
  economicOffer: async (req, res) => {
    const { id } = req.params;

    const response = await QuoteModel.economicOffer(req.ctx, id);
    res.status(response.code).send(response);
  },
};

export default QuoteController;
