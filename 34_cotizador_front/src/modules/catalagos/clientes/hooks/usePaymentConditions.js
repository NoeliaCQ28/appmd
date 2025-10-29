import { useQuery, useQueryClient } from "@tanstack/react-query";
import PaymentConditionService from "../services/paymentConditionService";

const QUERY_KEY = "paymentConditions";

export const usePaymentConditions = () => {
  const queryClient = useQueryClient();

  const { fetchAll } = PaymentConditionService;

  const {
    data: paymentConditions,
    isLoading: isLoadingPaymentConditions,
    error: errorPaymentConditions,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  return {
    paymentConditions,
    isLoadingPaymentConditions,
    errorPaymentConditions,
    refetch,
  };
};
