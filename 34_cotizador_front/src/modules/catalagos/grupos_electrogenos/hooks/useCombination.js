import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { notify } from "../../../../utils/notifications";
import generatorSetService from "../services/generatorSetService";
import useModelsSearch from "./useModelsSearch";

export const useCombination = () => {
  const qc = useQueryClient();

  const { search } = useModelsSearch();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: QUERY_KEYS.models });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.combinations });
    qc.invalidateQueries({ queryKey: QUERY_KEYS.generatorSets.search });
  };

  const { createCombination, updateCombination } = generatorSetService;

  const createCombinationMutation = useMutation({
    mutationFn: createCombination,
    onSuccess: (data) => {
      notify.success(data);
      invalidate();
      search();
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  const updateCombinationMutation = useMutation({
    mutationFn: updateCombination,
    onSuccess: (data) => {
      notify.success(data);
      invalidate();
      search();
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  return {
    createCombinationMutation,
    updateCombinationMutation,
  };
};
