import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { getModelos, getModelosv2 } from "../services/ElectrogenosService";
import { useParametros } from "./useParametros";

export const useModelos = () => {
  const [models, setModels] = useState([]);
  const [modelsV2, setModelsv2] = useState([]);
  const [selectedModels, setSelectedModels] = useState({});
  const [selectedModelsV2, setSelectedModelsV2] = useState({});

  const { cabinOptions } = useParametros();

  const { mutate } = useMutation({
    mutationFn: getModelos,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setModels(data);
      if (data.length > 0) {
        setSelectedModels(data[0]);
      } else {
        toast.error("No hay modelos a mostrar");
      }
    },
  });

  const { mutate: mutateModelsv2 } = useMutation({
    mutationFn: getModelosv2,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setModelsv2(data);
      if (data.length > 0) {
        setSelectedModelsV2(data[0]);
      } else {
        toast.error("No hay modelos a mostrar");
      }
    },
  });

  const handleConsultarComponentes = useCallback(
    (formData) => {
      const payload = {
        voltaje: formData.voltaje?.nIntVoltaje,
        frecuencia: formData.frecuencia?.nIntFrecuencia,
        fases: formData.fases?.nIntFases,
        factorPotencia: formData.factorPotencia?.nIntFP,
        altura: formData.altura?.Altura,
        temperatura: formData.temperatura?.Temperatura,
      };
      mutate(payload);

      const cabin = cabinOptions.find(
        (item) => item.description === formData.opcionesCabina
      );

      const payloadV2 = {
        voltaje: formData.voltaje?.nIntVoltaje,
        frecuencia: formData.frecuencia?.nIntFrecuencia,
        fases: formData.fases?.nIntFases,
        factorPotencia: formData.factorPotencia?.nIntFP,
        altura: formData.altura?.Altura,
        temperatura: formData.temperatura?.Temperatura,
        insonoro: cabin.id === 2 ? 1 : 0,
      };

      mutateModelsv2(payloadV2);
    },
    [cabinOptions, mutate, mutateModelsv2]
  );

  return {
    models,
    modelsV2,
    selectedModels,
    selectedModelsV2,
    setSelectedModels,
    setSelectedModelsV2,
    handleConsultarComponentes,
    mutateModelsv2
  };
};
