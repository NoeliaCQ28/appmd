import { logger } from "#libs/logger.js";
import QuoteCableModelAdapter from "./cables/QuoteCableModelAdapter";
import QuoteCellModelAdapter from "./cells/QuoteCellModelAdapter";
import QuoteGeneratorSetModel from "./generator_sets/QuoteGeneratorSetModel";
import QuoteTransformerModelAdapter from "./transformers/QuoteTransformerModelAdapter";

const QuoteRouter = ({ userId, quote, callback }) => {
  const type = quote?.cotizador_tipo
    ? Number.parseInt(quote.cotizador_tipo)
    : quote?.nCotTipo
      ? Number.parseInt(quote.nCotTipo)
      : null;

  callback?.(type);

  const detailHandlers = {
    1: QuoteGeneratorSetModel,
    2: QuoteCableModelAdapter,
    3: QuoteCellModelAdapter,
    4: QuoteTransformerModelAdapter,
  };

  const detailHandler = detailHandlers[type];

  if (!detailHandler) {
    logger.error(
      "QuoteRouter: No se encontró un manejador para el tipo de cotización",
      {
        type: type,
        availableTypes: Object.keys(detailHandlers),
      },
    );
    throw new Error(`No se encontró un manejador para el tipo ${type}`);
  }

  logger.info(
    `QuoteRouter: Usando manejador de tipo ${type} para la cotización`,
    {
      type: type,
    },
  );

  return {
    detailHandler,
  };
};

export default QuoteRouter;
