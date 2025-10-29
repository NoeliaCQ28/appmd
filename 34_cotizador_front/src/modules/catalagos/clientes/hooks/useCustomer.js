import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customerService from "../services/customerService";

const QUERY_KEY = "customers";

const useCustomer = (props) => {
  const queryClient = useQueryClient();

  const { fetchAll, createCustomer, editCustomer, deleteCustomer } =
    customerService;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  const { mutate: createMutate, isPending: isPendingCreateCustomer } =
    useMutation({
      mutationFn: createCustomer,
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        if (props.setNewCustomerId) {
          props.setNewCustomerId(data.data[0].Cliente_Id);
        }

        queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
        toast.success(data.message);
      },
    });

  const { mutate: editMutate, isPending: isPendingEditCustomer } = useMutation({
    mutationFn: editCustomer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteCustomer,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data);
    },
  });

  return {
    data,
    isLoading,
    error,
    createMutate,
    editMutate,
    deleteMutate,
    isPendingCreateCustomer,
    isPendingEditCustomer,
    refetch
  };
};

export default useCustomer;
