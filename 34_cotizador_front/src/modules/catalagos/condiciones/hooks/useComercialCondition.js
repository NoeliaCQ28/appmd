import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import comercialConditionsService from "../services/comercialConditionsService";

const QUERY_KEY = "comercial-conditions";

/**
 * Custom hook for managing commercial conditions with React Query
 * @returns {Object} Object containing:
 * @returns {Array} data - Array of commercial conditions
 * @returns {boolean} isLoading - Loading status of the query
 * @returns {Error|null} error - Error object if query fails
 * @returns {Function} createMutate - Mutation function to create a commercial condition
 * @returns {Function} updateMutate - Mutation function to update a commercial condition
 * @returns {Function} deleteMutate - Mutation function to delete a commercial condition
 */
const useComercialCondition = () => {
  const queryClient = useQueryClient();

  const {
    fetchAll,
    createComercialCondition,
    updateComercialCondition,
    deleteComercialCondition,
  } = comercialConditionsService;

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  const { mutate: createMutate } = useMutation({
    mutationFn: createComercialCondition,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data.message);
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: updateComercialCondition,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data.message);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteComercialCondition,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success(data.message);
    },
  });

  return {
    data,
    isLoading,
    error,
    createMutate,
    updateMutate,
    deleteMutate,
  };
};

export default useComercialCondition;
