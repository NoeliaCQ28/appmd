import QuoteCableDetailModel from "#models/quoteTypeModels/quoteCableDetailModel.js";

const QuoteCableModel = {
  createDetail: async ({ quoteDetailId, detail }) => {
    /**
     * @note
     * Implementa los metodos actuales de la version 1
     */
    QuoteCableDetailModel.attachCableDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
};

export default QuoteCableModel;
