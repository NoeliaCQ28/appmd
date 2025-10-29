import { useCallback, useEffect, useState } from "react";

export const useDerrateoTechnicalReport = ({ models, powerFactor }) => {
  const [derate, setDerate] = useState({
    prime: { KW: 0, KVA: 0 },
    standby: { KW: 0, KVA: 0 },
  });

  const calculatePowers = useCallback(() => {
    if (!models || models.length === 0) {
      setDerate({
        prime: { KW: 0, KVA: 0 },
        standby: { KW: 0, KVA: 0 },
      });
      return;
    }

    const primePowerKW =
      models.map((model) => Number.parseFloat(model.PoteciaPrime)).reduce((acc, a) => acc + a, 0) /
      models.length;

    const primePowerKVA = primePowerKW / powerFactor;

    const standbyPowerKW =
      models
        .map((model) => Number.parseFloat(model.PotenciaStandby))
        .reduce((acc, a) => acc + a, 0) / models.length;

    const standbyPowerKVA = standbyPowerKW / powerFactor;

    setDerate({
      prime: {
        KW: Number(primePowerKW.toFixed(2)),
        KVA: Number(primePowerKVA.toFixed(2)),
      },
      standby: {
        KW: Number(standbyPowerKW.toFixed(2)),
        KVA: Number(standbyPowerKVA.toFixed(2)),
      },
    });
  }, [models, powerFactor]);

  useEffect(() => {
    calculatePowers();
  }, [calculatePowers, models, powerFactor]);

  return {
    derate,
    setDerate,
  };
};
