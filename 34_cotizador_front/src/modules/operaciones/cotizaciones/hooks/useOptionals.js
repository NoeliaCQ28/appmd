import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import OptionalsService from "../services/optionalsService";

const QUERY_KEY = "optionals";

export const useOptionals = ({ integradoraId }) => {
  const {
    fetchByIntegradoraId,
    fetchAll,
    create,
    deleteOptional: remove,
    fetchAllBrands,
    fetchAllTypes,
    update,
  } = OptionalsService;

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY, integradoraId],
    queryFn: () => fetchByIntegradoraId(integradoraId),
    enabled: !!integradoraId,
    refetchInterval: 2000,
  });

  const {
    data: allOptionals,
    isLoading: isLoadingAllOptionals,
    error: errorAllOptionals,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchAll,
  });

  const {
    mutate: createOptional,
    isPending: isPendingCreateOptional,
    error: errorCreatingOptional,
  } = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, integradoraId]);
      queryClient.invalidateQueries([QUERY_KEY]);

      toast.success("Componente opcional creado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: deleteOptional,
    isPending: isPendingDeleteOptional,
    error: errorDeletingOptional,
  } = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, integradoraId]);
      queryClient.invalidateQueries([QUERY_KEY]);

      toast.success("Componente opcional eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: updateOptional,
    isPending: isPendingUpdateOptional,
    error: errorUpdatingOptional,
  } = useMutation({
    mutationFn: update,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, integradoraId]);
      queryClient.invalidateQueries([QUERY_KEY]);

      toast.success("Componente opcional actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    data: allBrands,
    isLoading: isLoadingAllBrands,
    error: errorAllBrands,
  } = useQuery({
    queryKey: ["accesorioes-ge-brands"],
    queryFn: fetchAllBrands,
  });

  const {
    data: allTypes,
    isLoading: isLoadingAllTypes,
    error: errorAllTypes,
  } = useQuery({
    queryKey: ["accesorioes-ge-types"],
    queryFn: fetchAllTypes,
  });

  const evalAccesoryPrice = ({ fixedMargin, variableMargin, cost }) => {
    const numericFixedMargin =
      typeof fixedMargin === "number" ? fixedMargin : 0;
    const numericVariableMargin =
      typeof variableMargin === "number" ? variableMargin : 0;
    const numericCost = typeof cost === "number" ? cost : 0;

    const result =
      numericCost /
      ((1 - numericFixedMargin / 100) * (1 - numericVariableMargin / 100));

    return result.toFixed(2);
  };

  return {
    optionals: data,
    isLoading,
    error,
    allOptionals,
    isLoadingAllOptionals,
    errorAllOptionals,
    createOptional,
    isPendingCreateOptional,
    errorCreatingOptional,
    deleteOptional,
    isPendingDeleteOptional,
    errorDeletingOptional,
    updateOptional,
    isPendingUpdateOptional,
    errorUpdatingOptional,
    allBrands,
    isLoadingAllBrands,
    errorAllBrands,
    allTypes,
    isLoadingAllTypes,
    errorAllTypes,
    evalAccesoryPrice,
  };
};
