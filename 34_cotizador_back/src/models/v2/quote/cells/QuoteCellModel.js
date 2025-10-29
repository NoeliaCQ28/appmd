import QuoteCellDetailModel from "#models/quoteTypeModels/quoteCellDetailModel.js";

const QuoteCellModel = {
  createDetail: async ({ quoteDetailId, detail }) => {
    /**
     * @note
     * Implementa los metodos actuales de la version 1
     */
    QuoteCellDetailModel.attachCellDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
};

export default QuoteCellModel;
