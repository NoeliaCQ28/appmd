import QuoteModel from "#models/v2/quote/QuoteModel.js";

const QuoteController = {
  create: async (req, res) => {
    const quote = req.body;

    const response = await QuoteModel.create({
      ctx: req.ctx,
      quote,
    });

    res.status(response.code).send(response);
  },
  getById: async (req, res) => {
    const { quoteId } = req.params;

    const response = await QuoteModel.getById({ ctx: req.ctx, quoteId });

    res.status(response.code).send(response);
  },
  updateDetail: async (req, res) => {
    const { quoteId, quoteDetailId } = req.params;
    const detail = req.body;

    const response = await QuoteModel.updateDetail({
      ctx: req.ctx,
      quoteId,
      quoteDetailId,
      detail,
    });

    res.status(response.code).send(response);
  },
  addDetails: async (req, res) => {
    const { quoteId } = req.params;
    const details = req.body;

    const response = await QuoteModel.addDetails({
      ctx: req.ctx,
      quoteId,
      details,
    });

    res.status(response.code).send(response);
  },
};

export default QuoteController;
