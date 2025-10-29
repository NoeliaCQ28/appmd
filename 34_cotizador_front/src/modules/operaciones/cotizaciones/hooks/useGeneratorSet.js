import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GeneratorSetService from "../services/generatorSetService";

const QUERY_KEY = "grupos-electrogenos";

export const useGeneratorSet = ({ supressToast } = {}) => {
  const { getParams, search, createGeneratorSet } = GeneratorSetService;

  const {
    data: generatorSetParams,
    isLoading: isLoadingGeneratorSetParams,
    error: errorGeneratorSetParams,
  } = useQuery({
    queryKey: [QUERY_KEY, "params"],
    queryFn: getParams,
    onError: (error) => {
      toast.error(
        `Error al obtener los parametros para los grupos electrogenos: ${error.message}`
      );
    },
  });

  const {
    mutate: searchGeneratorsSet,
    data: generatorsSetData,
    isPending: isLoadingGeneratorsSet,
    error: errorGeneratorsSet,
  } = useMutation({
    mutationFn: search,
    onSuccess: (data) => {
      if (supressToast) return;

      if (data.generatorsSet?.length === 0) {
        toast.info(
          "No se encontraron grupos electrógenos para los parámetros ingresados"
        );
      } else {
        toast.success("Grupos electrogenos encontrados con éxito");
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    mutate: createGeneratorSetMutate,
    isPending: isLoadingCreateGeneratorSet,
    error: errorCreateGeneratorSet,
  } = useMutation({
    mutationFn: createGeneratorSet,
    onSuccess: (data) => {
      if (supressToast) return;
      toast.success("Grupo electrógeno creado con éxito");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    generatorSetParams,
    isLoadingGeneratorSetParams,
    errorGeneratorSetParams,
    searchGeneratorsSet,
    generatorsSetData,
    isLoadingGeneratorsSet,
    errorGeneratorsSet,
    createGeneratorSetMutate,
    isLoadingCreateGeneratorSet,
    errorCreateGeneratorSet,
  };
};
