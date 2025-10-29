export const evalPrices = (combination, market) => {
  const accessoriesPrice = (combination.accessories || []).reduce(
    (total, accessory) => total + accessory.price,
    0
  );

  const operativeCosts = Object.values(combination.operativeCosts || {}).reduce(
    (total, cost) => (cost.isPresent ? total + cost.amount : total),
    0
  );

  const combinationPrice =
    combination.nIntPrecioTotalUSD + accessoriesPrice + operativeCosts;

  let finalPrice = 0;

  if (market !== "NACIONAL") {
    const exportMargin = combination.nIntMargenExportacionPorcentaje / 100;
    finalPrice = combinationPrice / (1 - exportMargin);
  } else {
    const discount = combination.nIntDescuentoPorcentaje / 100;
    finalPrice = combinationPrice * (1 - discount);
  }

  return {
    originalPrice: combinationPrice,
    finalPrice,
  };
};

export const composeName = (combination, onEdit = false) => {
  const modelName = onEdit ? combination.sModNombre : combination.sModNombre;
  const voltage = onEdit ? combination.nIntVoltaje : combination.nIntVoltaje;
  const frequency = onEdit
    ? combination.nIntFrecuencia
    : combination.nIntFrecuencia;
  const phases = onEdit ? combination.nIntFases : combination.nIntFases;
  const powerFactor = onEdit ? combination.nIntFP : combination.nIntFP;
  const altitude = onEdit ? combination.nIntAltura : combination.nIntAltura;
  const temperature = onEdit
    ? combination.nIntTemperatura
    : combination.nIntTemperatura;
  const itmBrand = onEdit ? combination.sITMMarca : combination.sITMMarca;
  const itmName = onEdit ? combination.sITMKitNombre : combination.sITMKit;

  const soundproof = onEdit
    ? combination.nIntInsonoro
    : combination.nIntInsonoro;

  return `GRUPO ELECTRÓGENO, ${modelName}, ${voltage}V, ${frequency}Hz, ${phases}F, ${powerFactor}FP, ${altitude}msnm, ${temperature}°C, ${itmName+"A" || "--"}, ${soundproof ? "INSONORO" : "ABIERTO"}`;
};
