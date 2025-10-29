import { useQuery } from "@tanstack/react-query";
import GeneratorSetService from "../../services/v2/GeneratorSetService";

export const useITMs = (id, integradoraId) => {
  const { getAllITMs, getAllITMsByCombination, getITMById } =
    GeneratorSetService;

  const {
    data: itms,
    isLoading: isLoadingITMs,
    isError: isErrorITMs,
  } = useQuery({
    queryKey: ["generatorSets", "v2", "itms"],
    queryFn: getAllITMs,
  });

  const {
    data: itmsByCombination,
    isLoading: isLoadingITMsByCombination,
    isError: isErrorITMsByCombination,
  } = useQuery({
    queryKey: ["generatorSets", "v2", "itms", "by-combination", integradoraId],
    queryFn: () => getAllITMsByCombination({ integradoraId }),
    enabled: !!integradoraId,
  });

  const {
    data: itm,
    isLoading: isLoadingITM,
    isError: isErrorITM,
  } = useQuery({
    queryFn: () => getITMById(id),
    enabled: !!id, // Only fetch if id is provided
    queryKey: ["generatorSets", "v2", "itms", id],
  });

  return {
    itms,
    isLoadingITMs,
    isErrorITMs,
    itm,
    isLoadingITM,
    isErrorITM,
    itmsByCombination,
    isLoadingITMsByCombination,
    isErrorITMsByCombination,
  };
};
