import { useQuery, useQueryClient } from "@tanstack/react-query";
import TaxIdTypeService from "../services/taxIdTypeService";
import CustomerBranchService from "../services/customerBranchService";

const QUERY_KEY = "customer-branches";

export const useCustomerBranch = () => {
  const queryClient = useQueryClient();

  const { fetchAll } = CustomerBranchService;

  const {
    data: customerBranches,
    isLoading: isLoadingCustomerBranches,
    error: errorCustomerBranches,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    customerBranches,
    isLoading: isLoadingCustomerBranches,
    error: errorCustomerBranches,
    refetch,
  };
};
