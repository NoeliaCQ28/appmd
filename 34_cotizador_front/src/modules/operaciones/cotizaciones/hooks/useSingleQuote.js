import { useQuery } from "@tanstack/react-query";
import QuoteService from "../services/quoteService";
import { useQuoteDetailStore } from "../store/useQuoteDetailStore";

const QUERY_KEY = "quotes";

const useSingleQuote = () => {
  const { selectedQuote } = useQuoteDetailStore();

  const { fetchById, fetchFichaTecnica, generateEconomicOffer } = QuoteService;

  const {
    data: quote,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY, selectedQuote?.Cotizacon_Id],
    queryFn: () => fetchById({ id: selectedQuote?.Cotizacon_Id }),
    enabled:
      selectedQuote?.Cotizacon_Id !== undefined &&
      selectedQuote?.Cotizacon_Id !== null,
  });

  const {
    data: technicalReport,
    isLoading: isLoadingTechnicalReport,
    error: errorTechnicalReport,
  } = useQuery({
    queryKey: [QUERY_KEY, selectedQuote?.Cotizacon_Id, "ficha-tecnica"],
    queryFn: () => fetchFichaTecnica({ id: selectedQuote?.Cotizacon_Id }),
    enabled:
      selectedQuote?.Cotizacon_Id !== undefined &&
      selectedQuote?.Cotizacon_Id !== null,
  });

  const {
    data: economicOffer,
    isLoading: isLoadingEconomicOffer,
    error: errorEconomicOffer,
    refetch: refetchEconomicOffer,
  } = useQuery({
    queryKey: [QUERY_KEY, selectedQuote?.Cotizacon_Id, "economic-offer"],
    queryFn: () =>
      generateEconomicOffer({ quoteId: selectedQuote?.Cotizacon_Id }),
    enabled:
      selectedQuote?.Cotizacon_Id !== undefined &&
      selectedQuote?.Cotizacon_Id !== null,
  });

  return {
    quote,
    refetch,
    technicalReport,
    isLoading,
    isLoadingTechnicalReport,
    error,
    errorTechnicalReport,
    economicOffer,
    isLoadingEconomicOffer,
    errorEconomicOffer,
    refetchEconomicOffer,
  };
};

export default useSingleQuote;
