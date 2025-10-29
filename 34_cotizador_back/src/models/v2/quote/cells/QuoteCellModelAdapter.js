import QuoteDetailsModel from "#models/quoteDetailsModel.js";
import QuoteCellDetailModel from "#models/quoteTypeModels/quoteCellDetailModel.js";

const QuoteCellModelAdapter = {
  createDetail: async ({ ctx, quoteDetailId, detail }) => {
    await QuoteCellDetailModel.attachCellDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
  getDetails: async ({ quoteId }) => {
    const response = await QuoteDetailsModel.getAllByQuoteId(quoteId);

    return response?.data;
  },
};

export default QuoteCellModelAdapter;
