import { useCallback, useEffect, useState } from "react";

export const useDerrateo = ({ models, powerFactor }) => {
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

    const modelsWithPositivePrime =
      models.filter((model) =>
        model.alternadores.some((a) => a.derate.prime.kw > 0)
      ).length || 1;

    const primePowerKW =
      models
        .map(
          (model) =>
            model.alternadores.reduce((acc, a) => acc + a.derate.prime.kw, 0) /
            (isNaN(
              model.alternadores.filter((a) => a.derate.prime.kw > 0.0).length
            )
              ? model.alternadores.filter((a) => a.derate.prime.kw > 0.0).length
              : 1)
        )
        .reduce((acc, a) => acc + a, 0) / modelsWithPositivePrime;

    const primePowerKVA = primePowerKW / powerFactor;

    const modelsWithPositiveStandby =
      models.filter((model) =>
        model.alternadores.some((a) => a.derate.standby.kw > 0)
      ).length || 1;

    const standbyPowerKW =
      models
        .map(
          (model) =>
            model.alternadores.reduce(
              (acc, a) => acc + a.derate.standby.kw,
              0
            ) /
            (isNaN(
              model.alternadores.filter((a) => a.derate.standby.kw > 0.0).length
            )
              ? model.alternadores.filter((a) => a.derate.standby.kw > 0.0)
                  .length
              : 1)
        )
        .reduce((acc, a) => acc + a, 0) / modelsWithPositiveStandby;

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
