import { useQuery, useQueryClient } from "@tanstack/react-query";
import CurrencyService from "./../services/currencyService";
const QUERY_KEY = "currencies";

const useCurrency = () => {
  const clientQuery = useQueryClient();

  const { fetchAll } = CurrencyService;

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    currencies: data,
    isLoading,
    isError,
  };
};

export default useCurrency;
