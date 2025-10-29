import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import customerContactsService from "../services/customerContactsService";

const useCustomersContacts = (customer_id) => {
  const queryClient = useQueryClient();

  const {
    fetchAllByCustomerId,
    createContact,
    editContact,
    deleteContact,
    fetchAllDenominations,
    fetchAllDeparments,
  } = customerContactsService;

  const { data, isLoading, error } = useQuery({
    queryKey: ["customers-contacts", customer_id],
    queryFn: () => fetchAllByCustomerId(customer_id),
    enabled: !!customer_id,
  });

  const { mutate: createMutate } = useMutation({
    mutationFn: createContact,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      const { customer_id } = variables;

      queryClient.invalidateQueries(["customers-contacts", customer_id]);
      toast.success(data);
    },
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: editContact,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      const { customer_id } = variables;

      queryClient.invalidateQueries(["customers-contacts", customer_id]);
      toast.success(data);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteContact,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data, variables) => {
      const { customer_id } = variables;

      queryClient.invalidateQueries(["customers-contacts", customer_id]);
      toast.success(data);
    },
  });

  const {
    data: denominationsData,
    isLoading: isLoadingDenominations,
    error: errorDenominations,
  } = useQuery({
    queryKey: ["customers-denominations"],
    queryFn: fetchAllDenominations,
  });

  const {
    data: departmentsData,
    isLoading: isLoadingDepartments,
    error: errorDepartments,
  } = useQuery({
    queryKey: ["customers-departments"],
    queryFn: fetchAllDeparments,
  });

  return {
    data,
    isLoading,
    error,
    createMutate,
    editMutate,
    deleteMutate,
    denominationsData,
    isLoadingDenominations,
    errorDenominations,
    departmentsData,
    isLoadingDepartments,
    errorDepartments,
  };
};

export default useCustomersContacts;
