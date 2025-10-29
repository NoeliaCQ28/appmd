import { useQuery, useQueryClient } from "@tanstack/react-query";
import TaxIdTypeService from "../services/taxIdTypeService";

const QUERY_KEY = "taxIdTypes";

export const useTaxIdType = () => {
  const queryClient = useQueryClient();

  const { fetchAll } = TaxIdTypeService;

  const {
    data: taxIdTypes,
    isLoading: isLoadingTaxIdTypes,
    error: errorTaxIdTypes,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    taxIdTypes,
    isLoading: isLoadingTaxIdTypes,
    error: errorTaxIdTypes,
    refetch,
  };
};
