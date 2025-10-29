import { useQuery } from "@tanstack/react-query";
import MarketsService from "../services/marketsService";

const QUERY_KEY = "markets";

const useMarket = () => {
  const { fetchAll } = MarketsService;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
    staleTime: 5 * 60 * 1000, // 5 minutos - los mercados no cambian frecuentemente
  });

  return {
    markets: data,
    isLoadingMarkets: isLoading,
    errorMarkets: error,
  };
};

export default useMarket;
