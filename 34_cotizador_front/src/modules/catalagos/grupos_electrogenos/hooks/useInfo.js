import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import generatorSetService from "../services/generatorSetService";

export const useInfo = ({ modelSelected }) => {
  const queryClient = useQueryClient();

  const {
    getMotorInfo,
    getAlternatorInfo,
    getModeloInfo,
    getModelPrices,
    updateMotorInfo,
    updatePowerMotorInfo,
    updateAlternadorInfo,
    updatePowerAlternatorInfo,
    updateModelosInfo,
    updateModelImages,
    updateModelPricesInfo,
    createPowerMotorInfo,
    createPowerAlternatorInfo,
    createMotorInfo,
    createAlternadorInfo,
  } = generatorSetService;

  const { data: motorInfo, refetch } = useQuery({
    queryKey: ["info-motor", modelSelected?.IntegradoraId],
    queryFn: () => getMotorInfo({ motorModelo: modelSelected?.Motor }),
    onError: (error) => {
      toast.error(error.message);
    },
    enabled: !!modelSelected,
  });

  const { data: alternatorInfo } = useQuery({
    queryKey: ["info-alternator", modelSelected?.IntegradoraId],
    queryFn: () =>
      getAlternatorInfo({ alternadorModelo: modelSelected?.Alternador }),
    onError: (error) => {
      toast.error(error.message);
    },
    enabled: !!modelSelected,
  });

  const { data: modeloInfo } = useQuery({
    queryKey: ["info-modelo", modelSelected?.IntegradoraId],
    queryFn: () => getModeloInfo({ modelo: modelSelected?.Modelo }),
    onError: (error) => {
      toast.error(error.message);
    },
    enabled: !!modelSelected,
  });

  const { data: modelPrices } = useQuery({
    queryKey: ["model-prices", modelSelected?.IntegradoraId],
    queryFn: () => getModelPrices({ model: modelSelected }),
    onError: (error) => {
      toast.error(error.message);
    },
    enabled: !!modelSelected && !!modelSelected?.IntegradoraId,
  });

  const { mutate: editMutateMotor } = useMutation({
    mutationFn: updateMotorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-motor"] });
      toast.success(data);
    },
  });

  const { mutate: editMutatePowerMotor } = useMutation({
    mutationFn: updatePowerMotorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-motor"] });
      toast.success(data);
    },
  });

  const { mutate: createMutatePowerMotor } = useMutation({
    mutationFn: createPowerMotorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-motor"] });
      toast.success(data);
    },
  });

  const { mutate: createMutatePowerAlternator } = useMutation({
    mutationFn: createPowerAlternatorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-alternator"] });
      toast.success(data);
    },
  });

  const { mutate: editMutateAlternador } = useMutation({
    mutationFn: updateAlternadorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-alternator"] });
      toast.success(data);
    },
  });

  const { mutate: editMutatePowerAlternator } = useMutation({
    mutationFn: updatePowerAlternatorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-alternator"] });
      toast.success(data);
    },
  });

  const { mutate: editMutateModelo } = useMutation({
    mutationFn: updateModelosInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-modelo"] });
      toast.success(data);
    },
  });

  const { mutate: editMutateModelImages } = useMutation({
    mutationFn: updateModelImages,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-modelo"] });
      toast.success(data);
    },
  });

  const { mutate: editModelPrices } = useMutation({
    mutationFn: updateModelPricesInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["model-prices"] });
      toast.success(data);
    },
  });

  const { mutate: createMutateMotor } = useMutation({
    mutationFn: createMotorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-motor"] });
      toast.success(data);
    },
  });

  const { mutate: createMutateAlternador } = useMutation({
    mutationFn: createAlternadorInfo,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["info-alternator"] });
      toast.success(data);
    },
  });

  return {
    motorInfo,
    alternatorInfo,
    modeloInfo,
    modelPrices,
    editMutateMotor,
    editMutatePowerMotor,
    editMutateAlternador,
    editMutatePowerAlternator,
    editMutateModelo,
    editMutateModelImages,
    editModelPrices,
    createMutatePowerMotor,
    createMutatePowerAlternator,
    createMutateMotor,
    createMutateAlternador,
  };
};
