import { ToggleButton } from "primereact/togglebutton";
import { Slider } from "primereact/slider";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { cn } from "../../utils/utils";
import site from "../../config/site";
import { useTranslation } from "react-i18next";

export const PowerSearchSlider = ({
  className,
  onPowerChange, // Único callback necesario
  checkedKVA,
  setCheckedKVA,
  onReset,
}) => {
  const [powerTreshold, setPowerPrimeTreshold] = React.useState(20);
  const [selectedRegime, setSelectedRegime] = React.useState("STANDBY");



  const { t } = useTranslation();

  const regimeOptions = [
    { label: "PRIME", value: "PRIME" },
    { label: "STANDBY", value: "STANDBY" },
  ];

  // Límites fijos del slider (0 a 3400) - NO dependen de derateRange
  const powerMin = 0;
  const powerMax = 3400;

  // Estado interno del slider (completamente independiente)
  const [internalPrimeValue, setInternalPrimeValue] = React.useState([powerMin, powerMax]);
  const [internalStandbyValue, setInternalStandbyValue] = React.useState([powerMin, powerMax]);

  // Estado interno del slider según el régimen actual
  const internalValue = selectedRegime === "PRIME" ? internalPrimeValue : internalStandbyValue;
  const setInternalValue = selectedRegime === "PRIME" ? setInternalPrimeValue : setInternalStandbyValue;

  // Valor del slider: SIEMPRE usar el interno (no controlado)
  const powerValue = internalValue;

  // Valor para mostrar en el texto
  const displayValue = internalValue;

  const handlePowerChange = (value) => {
    if (Array.isArray(value)) {
      // Actualizar estado interno durante el arrastre
      setInternalValue(value);
    }
  };

  const handlePowerChangeEnd = (e) => {
    // Cuando el usuario suelta el slider, enviar el valor final
    // Usar e.value directamente del evento para obtener el valor más reciente
    const finalValue = e.value || internalValue;

    if (finalValue && Array.isArray(finalValue)) {
      const [minVal, maxVal] = finalValue;

      // Si ambos están en los extremos, usar "Todos"
      const isFullRange =
        Math.abs(minVal - powerMin) < 0.01 &&
        Math.abs(maxVal - powerMax) < 0.01;

      // Crear el objeto estructurado para enviar al padre
      const powerData = {
        regime: selectedRegime,
        range: {
          min: minVal,
          max: maxVal,
          isAll: isFullRange
        }
      };

      // Enviar datos al padre si hay callback
      if (onPowerChange) {
        onPowerChange(powerData);
      }
    }
  };

  React.useEffect(() => {
    // Resetear el estado interno
    setInternalValue([powerMin, powerMax]);

    // Notificar al padre
    if (onPowerChange) {
      onPowerChange({
        regime: selectedRegime,
        range: {
          min: powerMin,
          max: powerMax,
          isAll: true
        }
      });
    }
  }, [onReset]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle de unidades */}
      <div className="flex items-center justify-between">
        <label htmlFor="unitToggle" className="text-sm font-medium uppercase">
          {t("technical_report.unity_measure")}
        </label>
        <ToggleButton
          id="unitToggle"
          role="switch"
          aria-checked={checkedKVA}
          checked={checkedKVA}
          onChange={(e) => setCheckedKVA(e.value)}
          onLabel={site.powerUnits.kilovoltAmpere}
          offLabel={site.powerUnits.kilowatt}
          className={`text-xs font-bold px-2 py-1.5 rounded-lg border-0 focus:outline-none transition-all ${checkedKVA
            ? "bg-orange-500 text-white hover:shadow-orange-500 hover:shadow-md"
            : "bg-[#2563eb] text-white hover:shadow-[#2563eb] hover:shadow-md"
            }`}
        />
      </div>

      {/* Select de Régimen */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t("technical_report.power_regime") || "Régimen de Potencia"}
        </label>
        <Dropdown
          value={selectedRegime}
          onChange={(e) => setSelectedRegime(e.value)}
          options={regimeOptions}
          placeholder="Seleccione régimen"
          className="w-full"
        />
      </div>

      {/* Slider de Potencia */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {selectedRegime === "PRIME"
              ? t("technical_report.prime_power")
              : t("technical_report.standby_power")}
          </label>
          <span className="text-xs font-semibold text-gray-600">
            {(() => {
              // Usar displayValue para mostrar el valor en tiempo real
              if (Array.isArray(displayValue)) {
                const [min, max] = displayValue;
                // Si ambos están en los extremos, mostrar "Todos"
                const isFullRange =
                  Math.abs(min - powerMin) < 0.01 &&
                  Math.abs(max - powerMax) < 0.01;

                if (isFullRange) {
                  return t("common.all");
                }

                return `${min.toFixed(2)} - ${max.toFixed(2)} ${checkedKVA
                  ? site.powerUnits.kilovoltAmpere
                  : site.powerUnits.kilowatt
                  }`;
              }
              return t("common.all");
            })()}
          </span>
        </div>
        <Slider
          value={powerValue}
          onChange={(e) => handlePowerChange(e.value)}
          onSlideEnd={handlePowerChangeEnd}
          min={powerMin}
          max={powerMax}
          step={(powerMax - powerMin) / 100}
          range
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {powerMin.toFixed(2)}{" "}
            {checkedKVA
              ? site.powerUnits.kilovoltAmpere
              : site.powerUnits.kilowatt}
          </span>
          <span>
            {powerMax.toFixed(2)}{" "}
            {checkedKVA
              ? site.powerUnits.kilovoltAmpere
              : site.powerUnits.kilowatt}
          </span>
        </div>

        <div className="text-xs text-gray-600 mt-2">
          <p>
            {t("technical_report.threshold_note")}{" "}
            <span className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded font-mono">
              +/- {powerTreshold} %
            </span>
          </p>
          <p className="mt-1 text-gray-500">
            {t("technical_report.range_info") || "Mueva ambas manijas a los extremos para seleccionar todos"}
          </p>
        </div>
      </div>
    </div>
  );
};
