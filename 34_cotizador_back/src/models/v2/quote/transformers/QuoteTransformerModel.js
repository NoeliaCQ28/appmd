import QuoteTransformerDetailModel from "#models/quoteTypeModels/quoteTransformerDetailModel.js";

const QuoteTransformerModel = {
  createDetail: async ({ quoteDetailId, detail }) => {
    /**
     * @note
     * Implementa los metodos actuales de la version 1
     */
    QuoteTransformerDetailModel.attachTransformerDetailToQuote({
      quote_detail_id: quoteDetailId,
      details: detail,
    });
  },
};

export default QuoteTransformerModel;
