import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export const GeneratorSerCombinationPriceSectionInfo = ({
  combination = {},
  currency = { symbol: "$" },
  evalTypeChange,
}) => {

  // === GRUPO ELECTRÓGENO ===
  const rawCostGE = parseFloat(combination?.nIntCostoGEAbierto ?? NaN);
  const rawMargenGE = parseFloat(combination?.nMrgFactorMargen ?? NaN);
  const rawDescuentoGE = parseFloat(combination?.nMrgFactorDescuento ?? NaN);

  const costGE = Number.isFinite(rawCostGE) ? rawCostGE : 0;
  const factorMargenGE =
    Number.isFinite(rawMargenGE) && rawMargenGE !== 0 ? rawMargenGE : 1;
  const factorDescuentoGE =
    Number.isFinite(rawDescuentoGE) && rawDescuentoGE !== 0
      ? rawDescuentoGE
      : 1;
  const priceGE = costGE / factorMargenGE / factorDescuentoGE;
  const formattedPriceGE = evalTypeChange(priceGE, currency);

  // === ALTERNADOR ===
  const rawCostALT = parseFloat(combination?.nAltCostoUSD ?? NaN);
  const rawMargenALT = parseFloat(combination?.nMrgFactorMargen ?? NaN);
  const rawDescuentoALT = parseFloat(combination?.nMrgFactorDescuento ?? NaN);

  const costALT = Number.isFinite(rawCostALT) ? rawCostALT : 0;
  const factorMargenALT =
    Number.isFinite(rawMargenALT) && rawMargenALT !== 0 ? rawMargenALT : 1;
  const factorDescuentoALT =
    Number.isFinite(rawDescuentoALT) && rawDescuentoALT !== 0
      ? rawDescuentoALT
      : 1;
  const priceALT = costALT / factorMargenALT / factorDescuentoALT;
  const formattedPriceALT = evalTypeChange(priceALT, currency);

  // === CABINA DE GE ===
  const rawCostCAB = parseFloat(combination?.nIntCostoGECabina ?? NaN);
  const rawMargenCAB = parseFloat(combination?.nMrgFactorMargen ?? NaN);
  const rawDescuentoCAB = parseFloat(combination?.nMrgFactorDescuento ?? NaN);

  const costCAB = Number.isFinite(rawCostCAB) ? rawCostCAB : 0;
  const factorMargenCAB =
    Number.isFinite(rawMargenCAB) && rawMargenCAB !== 0 ? rawMargenCAB : 1;
  const factorDescuentoCAB =
    Number.isFinite(rawDescuentoCAB) && rawDescuentoCAB !== 0
      ? rawDescuentoCAB
      : 1;
  const priceCAB = costCAB / factorMargenCAB / factorDescuentoCAB;
  const formattedPriceCAB = evalTypeChange(priceCAB, currency);

  // LaTeX unificado con tres componentes
  const latexBlock = `P_{GE} = \\dfrac{${costGE}}{${factorMargenGE} \\cdot ${factorDescuentoGE}} \\quad P_{ALT} = \\dfrac{${costALT}}{${factorMargenALT} \\cdot ${factorDescuentoALT}} \\quad P_{CAB} = \\dfrac{${costCAB}}{${factorMargenCAB} \\cdot ${factorDescuentoCAB}}`;

    // LaTeX unificado con tres componentes
  const latexBlockAccesory = `P_{Accesorio} = \\dfrac{Costo_{Accesorio}}{Margen_{(F1)} \\cdot 0.6}`;;

  const hasAdjustment =
    rawMargenGE === 0 ||
    rawDescuentoGE === 0 ||
    !Number.isFinite(rawMargenGE) ||
    !Number.isFinite(rawDescuentoGE) ||
    rawMargenALT === 0 ||
    rawDescuentoALT === 0 ||
    !Number.isFinite(rawMargenALT) ||
    !Number.isFinite(rawDescuentoALT) ||
    rawMargenCAB === 0 ||
    rawDescuentoCAB === 0 ||
    !Number.isFinite(rawMargenCAB) ||
    !Number.isFinite(rawDescuentoCAB);

  return (
    <div className="rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <h3 className="font-medium text-sm text-gray-800 text-center">
          Cálculo de Precios
        </h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Factores */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Factores
          </h4>
          {/* Factores */}
          <div className="border border-gray-100 rounded p-2 space-y-1">
            <div className="space-y-1 text-xs">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen (F1):</span>
                  <span className="font-mono">
                    {combination?.nMrgFactorMargen ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Descuento (F2):</span>
                  <span className="font-mono">
                    {combination?.nMrgFactorDescuento ?? "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 space-y-3">
        {/* Parámetros */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Parámetros
          </h4>

          {/* Grupo Electrógeno */}
          <div className="border border-gray-100 rounded p-2 space-y-1">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Grupo Electrógeno
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Costo:</span>
                <span className="font-mono">
                  {currency.symbol}{" "}
                  {evalTypeChange(combination?.nIntCostoGEAbierto, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Alternador */}
          <div className="border border-gray-100 rounded p-2 space-y-1">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Alternador
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Costo:</span>
                <span className="font-mono">
                  {currency.symbol}{" "}
                  {evalTypeChange(combination?.nAltCostoUSD, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Cabina de GE */}
          <div className="border border-gray-100 rounded p-2 space-y-1">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Cabina de GE
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Costo:</span>
                <span className="font-mono">
                  {currency.symbol}{" "}
                  {evalTypeChange(combination?.nIntCostoGECabina, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fórmula */}
        <div className="border-t border-gray-100 pt-3 gap-3 flex flex-col">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Fórmula de precio de lista de los materiales
          </h4>
          <div className="text-center overflow-x-auto">
            <BlockMath math={latexBlock} />
          </div>
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Fórmula de precio de lista de los accesorios
          </h4>
          <div className="text-center overflow-x-auto">
            <BlockMath math={latexBlockAccesory} />
          </div>
        </div>

        {/* Resultados */}
        <div className="border-t border-gray-100 pt-3 space-y-2">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Resultados
          </h4>

          <div className="space-y-1">
            <div className="flex justify-between items-center py-1 px-2 border border-gray-100 rounded">
              <span className="text-xs text-gray-600">Precio GE Abierto:</span>
              <span className="font-mono font-semibold text-sm">
                {currency.symbol} {formattedPriceGE}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 px-2 border border-gray-100 rounded">
              <span className="text-xs text-gray-600">Precio ALT:</span>
              <span className="font-mono font-semibold text-sm">
                {currency.symbol} {formattedPriceALT}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 px-2 border border-gray-100 rounded">
              <span className="text-xs text-gray-600">Precio CAB:</span>
              <span className="font-mono font-semibold text-sm">
                {currency.symbol} {formattedPriceCAB}
              </span>
            </div>
          </div>
        </div>

        {/* Nota */}
        {hasAdjustment && (
          <div className="border-t border-gray-100 pt-2">
            <p className="text-xs text-gray-500 italic">
              * Factor inválido sustituido por 1 para evitar división por cero.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
