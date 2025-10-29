import { useQuery, useQueryClient } from "@tanstack/react-query";
import SocietyService from "../services/societyService";
import TaxClassService from "../services/taxClassService";

const QUERY_KEY = "taxClasses";

export const useTaxClass = () => {
  const queryClient = useQueryClient();

  const { fetchAll } = TaxClassService;

  const {
    data: taxClasses,
    isLoading: isLoadingTaxClasses,
    error: errorTaxClasses,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    taxClasses,
    isLoadingTaxClasses,
    errorTaxClasses,
    refetch,
  };
};
