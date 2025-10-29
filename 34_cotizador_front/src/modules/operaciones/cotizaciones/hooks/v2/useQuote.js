import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../../../utils/notifications";
import QuoteService from "../../services/v2/QuoteService";
import { useQuoteDetailStore } from "../../store/useQuoteDetailStore";

export const useQuote = () => {
  const { updateDetail, addDetails } = QuoteService;
  const { selectedQuote } = useQuoteDetailStore();

  const qc = useQueryClient();

  const {
    mutate: updateDetailMutate,
    isPending: isUpdateDetailPending,
    isError: isUpdateDetailError,
  } = useMutation({
    mutationFn: updateDetail,
    onError: (error) => notify.error(error),
    onSuccess: (message) => {
      notify.success(message);
      qc.invalidateQueries({
        queryKey: ["quotes", selectedQuote?.Cotizacon_Id],
      });
    },
  });

  const {
    mutate: addDetailsMutate,
    isPending: isAddDetailsPending,
    isError: isAddDetailsError,
  } = useMutation({
    mutationFn: addDetails,
    onError: (error) => notify.error(error),
    onSuccess: (message) => {
      notify.success(message);
      qc.invalidateQueries({
        queryKey: ["quotes", selectedQuote?.Cotizacon_Id],
      });
    },
  });

  return {
    updateDetailMutate,
    isUpdateDetailPending,
    isUpdateDetailError,
    addDetailsMutate,
    isAddDetailsPending,
    isAddDetailsError,
  };
};
