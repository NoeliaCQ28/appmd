import QuoteDetailsModel from "#models/quoteDetailsModel.js";
import QuoteCableDetailModel from "#models/quoteTypeModels/quoteCableDetailModel.js";

const QuoteCableModelAdapter = {
  createDetail: async ({ ctx, quoteDetailId, detail }) => {
    await QuoteCableDetailModel.attachCableDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
  getDetails: async ({ quoteId }) => {
    const response = await QuoteDetailsModel.getAllByQuoteId(quoteId);

    return response?.data;
  },
};

export default QuoteCableModelAdapter;
