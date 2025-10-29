import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import QuoteService from "../services/quoteService";

const QUERY_KEY = "quotes";

const useQuote = () => {
  const queryClient = useQueryClient();

  const {
    fetchAll,
    fetchAllOnlyOrders,
    createQuote,
    updateQuote,
    updateStateQuote,
    deleteQuote,
    deleteDetailOfQuote,
    updateDetailOfQuote,
    validateQuote,
    updateQuantity,
    addItemsDetails,
    addItems,
  } = QuoteService;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  const {
    data: onlyOrdersQuotes,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: [QUERY_KEY, "onlyOrders"],
    queryFn: fetchAllOnlyOrders,
  });

  const { mutate: createMutate } = useMutation({
    mutationFn: createQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data.message);
      return data.message;
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, variables.id, "economic-offer"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, variables.id, "ficha-tecnica"],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

      toast.success(data.message);
      return data.message;
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data.message);
      return data.message;
    },
  });

  const {
    mutate: mutateState,
    isPending: isPendingMutateState,
    error: errorMutateState,
  } = useMutation({
    mutationFn: updateStateQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, id] });
      toast.success(data.message);
      return data.message;
    },
  });

  const { mutate: deleteDetailOfQuoteMutate } = useMutation({
    mutationFn: deleteDetailOfQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, quoteId] });
      toast.success(data.message);
      return data.message;
    },
  });

  const { mutate: updateDetailOfQuoteMutate } = useMutation({
    mutationFn: updateDetailOfQuote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, { quoteId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, quoteId] });
      toast.success(data.message);
      return data.message;
    },
  });

  const {
    mutate: validateQuoteMutate,
    data: validateQuoteData,
    isPending: isPendingValidateQuote,
    error: validateQuoteError,
  } = useMutation({
    mutationFn: validateQuote,
  });

  const { mutate: updateMutateQuantity } = useMutation({
    mutationFn: updateQuantity,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, variables.id, "economic-offer"],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });

      toast.success(data.message);
      return data.message;
    },
  });

  const { mutate: addItemsDetailsMutate, isPending: isPendingAddItemsDetails } =
    useMutation({
      mutationFn: addItemsDetails,
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY, variables.quoteId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY, variables.quoteId, "economic-offer"],
        });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success(data);
      },
    });

  const { mutate: addItemsMutate, isPending: isPendingAddItems } = useMutation({
    mutationFn: addItems,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, variables.quoteId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, variables.quoteId, "economic-offer"],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data);
    },
  });

  return {
    data,
    refetch,
    isLoading,
    error,
    onlyOrdersQuotes,
    isLoadingOrders,
    ordersError,
    createMutate,
    updateMutate,
    mutateState,
    deleteMutate,
    deleteDetailOfQuoteMutate,
    updateDetailOfQuoteMutate,
    isPendingMutateState,
    errorMutateState,
    validateQuoteMutate,
    validateQuoteData,
    isPendingValidateQuote,
    validateQuoteError,
    updateMutateQuantity,
    addItemsDetailsMutate,
    isPendingAddItemsDetails,
    addItemsMutate,
    isPendingAddItems,
  };
};

export default useQuote;
