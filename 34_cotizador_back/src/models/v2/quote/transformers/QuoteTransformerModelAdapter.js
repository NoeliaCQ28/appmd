import QuoteDetailsModel from "#models/quoteDetailsModel.js";
import QuoteTransformerDetailModel from "#models/quoteTypeModels/quoteTransformerDetailModel.js";

const QuoteTransformerModelAdapter = {
  createDetail: async ({ ctx, quoteDetailId, detail }) => {
    await QuoteTransformerDetailModel.attachTransformerDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
  getDetails: async ({ ctx, quoteId }) => {
    const response = await QuoteDetailsModel.getAllByQuoteId(quoteId);

    return response?.data;
  },
};

export default QuoteTransformerModelAdapter;
