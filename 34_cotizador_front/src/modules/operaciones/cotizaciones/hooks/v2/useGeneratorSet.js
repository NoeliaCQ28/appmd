import { useMutation } from "@tanstack/react-query";
import GeneratorSetService from "../../services/v2/GeneratorSetService";
import { notify } from "../../../../../utils/notifications";

export const useGeneratorSet = () => {
  const {
    data: combinations,
    mutate: getCombinations,
    isPending: isPendingCombinations,
    isError: isErrorCombinations,
  } = useMutation({
    mutationKey: ["generatorSets", "v2", "combinations"],
    mutationFn: GeneratorSetService.getAllCombinations,
    onSuccess: (data) => {
      if (data?.generatorSets?.length === 0) {
        notify.warning("No existen grupos electrógenos con esa configuración");
      }
    },
  });
  const {
    data: combinationSwaped,
    mutate: changeConfiguration,
    mutateAsync: changeConfigurationAsync,
    isPending: isPendingSwap,
    isError: isErrorSwap,
  } = useMutation({
    mutationFn: GeneratorSetService.changeConfiguration,
    onError: notify.error,
  });

  return {
    combinations,
    getCombinations,
    isPendingCombinations,
    isErrorCombinations,
    combinationSwaped,
    changeConfiguration,
    changeConfigurationAsync,
    isPendingSwap,
    isErrorSwap,
  };
};
