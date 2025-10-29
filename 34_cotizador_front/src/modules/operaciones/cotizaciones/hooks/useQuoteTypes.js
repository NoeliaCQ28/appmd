import { useQuery } from "@tanstack/react-query";
import QuoteService from "../services/quoteService";

const QUERY_KEY = "quotes";

const useQuoteTypes = () => {
  const { fetchAllTypes } = QuoteService;

  const {
    data: quoteTypes,
    isLoading: isLoadingQuoteTypes,
    error: errorQuoteTypes,
  } = useQuery({
    queryKey: [QUERY_KEY, "types"],
    queryFn: fetchAllTypes,
    staleTime: 60000,
  });

  return {
    quoteTypes,
    isLoadingQuoteTypes,
    errorQuoteTypes,
  };
};

export default useQuoteTypes;
