import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import generatorSetService from "../services/generatorSetService";
import { useGeneratorSetStore } from "../stores/useGeneratorSetStore";

const QUERY_KEY = "models-search";

const useModelsSearch = () => {
  const queryClient = useQueryClient();

  const { searchFilters } = useGeneratorSetStore();

  const {
    searchModels,
    getModels,
    getMotorBrands,
    getMotorModels,
    getAlternatorBrands,
    getAlternatorModels,
    getVoltages,
    getFrequencies,
    getPhases,
    getPowerFactors,
    getAltitudes,
    getITMs,
    getMarkets,
    removeModeloGeAndIntegradora,
  } = generatorSetService;

  const { data: modelsName, isLoading: isLoadingModels } = useQuery({
    queryKey: [QUERY_KEY, "models"],
    queryFn: getModels,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: motorBrands, isLoading: isLoadingMotorBrands } = useQuery({
    queryKey: [QUERY_KEY, "motor-brands"],
    queryFn: getMotorBrands,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: motorModels, isLoading: isLoadingMotorModels } = useQuery({
    queryKey: [QUERY_KEY, "motor-models"],
    queryFn: getMotorModels,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: alternatorBrands, isLoading: isLoadingAlternatorBrands } =
    useQuery({
      queryKey: [QUERY_KEY, "alternator-brands"],
      queryFn: getAlternatorBrands,
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { data: alternatorModels, isLoading: isLoadingAlternatorModels } =
    useQuery({
      queryKey: [QUERY_KEY, "alternator-models"],
      queryFn: getAlternatorModels,
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { data: voltages, isLoading: isLoadingVoltages } = useQuery({
    queryKey: [QUERY_KEY, "voltages"],
    queryFn: getVoltages,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: frequencies, isLoading: isLoadingFrequencies } = useQuery({
    queryKey: [QUERY_KEY, "frequencies"],
    queryFn: getFrequencies,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: phases, isLoading: isLoadingPhases } = useQuery({
    queryKey: [QUERY_KEY, "phases"],
    queryFn: getPhases,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: powerFactors, isLoading: isLoadingPowerFactors } = useQuery({
    queryKey: [QUERY_KEY, "power-factors"],
    queryFn: getPowerFactors,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: altitudes = [], isLoading: isLoadingAltitudes } = useQuery({
    queryKey: [QUERY_KEY, "altitudes"],
    queryFn: getAltitudes,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: itms = [], isLoading: isLoadingITMs } = useQuery({
    queryKey: [QUERY_KEY, "itms"],
    queryFn: getITMs,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data: markets = [], isLoading: isLoadingMarkets } = useQuery({
    queryKey: [QUERY_KEY, "markets"],
    queryFn: getMarkets,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const {
    data: models = [],
    refetch: search,
    isLoading: isSearching,
  } = useQuery({
    queryKey: QUERY_KEYS.generatorSets.search,
    queryFn: () => searchModels({ params: searchFilters }),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    enabled: false,
  });

  const { mutate: deleteModeloGeAndIntegradora } = useMutation({
    mutationFn: removeModeloGeAndIntegradora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries([QUERY_KEY, "models"]);
      toast.success("Modelo GE eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    models: models?.map((model, index) => ({
      ...model,
      id: index + 1,
    })),
    search,
    modelsName,
    motorBrands,
    motorModels,
    alternatorBrands,
    alternatorModels,
    voltages,
    frequencies,
    phases,
    powerFactors,
    altitudes,
    itms,
    markets,
    deleteModeloGeAndIntegradora,
    isLoading: {
      models: isLoadingModels,
      motorBrands: isLoadingMotorBrands,
      motorModels: isLoadingMotorModels,
      alternatorBrands: isLoadingAlternatorBrands,
      alternatorModels: isLoadingAlternatorModels,
      voltages: isLoadingVoltages,
      frequencies: isLoadingFrequencies,
      phases: isLoadingPhases,
      powerFactors: isLoadingPowerFactors,
      altitudes: isLoadingAltitudes,
      itms: isLoadingITMs,
      markets: isLoadingMarkets,
      searching: isSearching,
    },
  };
};

export default useModelsSearch;
