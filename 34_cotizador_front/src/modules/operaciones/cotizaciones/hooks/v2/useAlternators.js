import { useQuery } from "@tanstack/react-query";
import GeneratorSetService from "../../services/v2/GeneratorSetService";

export const useAlternators = (id, integradoraId) => {
  const {
    getAllAlternators,
    getAllAlternatorsByCombination,
    getAlternatorById,
  } = GeneratorSetService;

  const {
    data: alternators,
    isLoading: isLoadingAlternators,
    isError: isErrorAlternators,
  } = useQuery({
    queryKey: ["generatorSets", "v2", "alternators"],
    queryFn: getAllAlternators,
  });

  const {
    data: alternatorsByCombination,
    isLoading: isLoadingAlternatorsByCombination,
    isError: isErrorAlternatorsByCombination,
  } = useQuery({
    queryKey: [
      "generatorSets",
      "v2",
      "alternators",
      "by-combination",
      integradoraId,
    ],
    queryFn: () => getAllAlternatorsByCombination({ integradoraId }),
    enabled: !!integradoraId,
  });

  const {
    data: alternator,
    isLoading: isLoadingAlternator,
    isError: isErrorAlternator,
  } = useQuery({
    queryFn: () => getAlternatorById(id),
    enabled: !!id, // Only fetch if id is provided
    queryKey: ["generatorSets", "v2", "alternators", id],
  });

  return {
    alternators,
    isLoadingAlternators,
    isErrorAlternators,
    alternator,
    isLoadingAlternator,
    isErrorAlternator,
    alternatorsByCombination,
    isLoadingAlternatorsByCombination,
    isErrorAlternatorsByCombination,
  };
};
