import { BadgeAlert, BadgeInfo } from "lucide-react";
import { BlockMath } from "react-katex";
import { Button } from "../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { useEditData } from "../hooks/useEditData";
import { useInfo } from "../hooks/useInfo";

export const ModelPrices = ({ modelSelected }) => {
  const { modelPrices, editModelPrices } = useInfo({ modelSelected });

  const data = modelPrices?.[0];

  const { editData, handleChange, handleSave } = useEditData(
    data,
    editModelPrices
  );

  if (!data)
    return (
      <div className=" border border-dashed p-2 rounded-lg text-yellow-900 flex gap-2">
        <BadgeAlert /> <span>El modelo no dispone de ninguna combinación</span>
      </div>
    );

  const costGE = data?.nIntCostoGEAbierto || 0;
  const costCAB = data?.nIntCostoGECabina || 0;
  const priceGE = Number(data?.nIntPrecioGEAbierto) || 0;
  const priceCAB = Number(data?.nIntPrecioGECabina) || 0;
  const factorMargenGE = data?.nMrgFactorMargen || 1;
  const factorDescuentoGE = data?.nMrgFactorDescuento || 1;

  const totalPriceGeneratorSetSoundProof = priceGE + priceCAB;

  const latexBlock = `P_{GE} = \\dfrac{${costGE}}{${factorMargenGE} \\cdot ${factorDescuentoGE}} \\quad P_{CAB} = \\dfrac{${costCAB}}{${factorMargenGE} \\cdot ${factorDescuentoGE}}`;

  const latexTotalGeneratorSetSoundProof = `P_{Total} = ${priceGE} + ${priceCAB} = ${totalPriceGeneratorSetSoundProof}`;

  return (
    <div className="rounded-lg transition-all duration-300">
      <section className="mb-8">
        <h2 className="text-2xl font-bold pb-2 border-b">
          {modelSelected.Modelo}
        </h2>

        <div className="mt-4 p-4 rounded-lg border-b bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <span className="w-24  font-medium">Motor:</span>
                <span className="text-gray-700">{modelSelected.Motor}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24  font-medium">Alternador:</span>
                <span className="text-gray-700">
                  {modelSelected.Alternador}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center text-sm">
                <span className="w-14 font-medium">Voltaje:</span>
                <span className="text-gray-700 line-clamp-1">
                  {modelSelected.Voltaje} V
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24 font-medium">Frecuencia:</span>
                <span className="text-gray-700 line-clamp-1">
                  {modelSelected.Frecuencia} Hz
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-14  font-medium">Fases:</span>
                <span className="text-gray-700 line-clamp-1">
                  {modelSelected.Fases}{" "}
                  {Number(modelSelected.Fases) === 3 ? "(Trifasico)" : ""}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-24  font-medium">Factor:</span>
                <span className="text-gray-700">
                  {modelSelected.FactorPotencia}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-lg border-b bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <span className="w-36 line-clamp-1 font-medium">
                  Margen (Factor 1):
                </span>
                <span className="text-gray-700">{data?.nMrgFactorMargen}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="w-36 line-clamp-1 font-medium">
                  Descuento (Factor 2):
                </span>
                <span className="text-gray-700">
                  {data?.nMrgFactorDescuento}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-5">
            {/* Open Version Pricing */}
            <InfoSection title="Versión Abierta">
              <InfoItem
                label="Costo"
                value={editData.nIntCostoGEAbierto}
                onChange={(val) => handleChange("nIntCostoGEAbierto", val)}
              />
              <InfoItem
                label="Precio de Lista"
                value={editData.nIntPrecioGEAbierto}
                disabled
              />
            </InfoSection>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Cabined Version Pricing */}
            <InfoSection title="Cabina">
              <InfoItem
                label="Costo"
                value={editData.nIntCostoGECabina}
                onChange={(val) => handleChange("nIntCostoGECabina", val)}
              />
              <InfoItem
                label="Precio de Lista"
                value={editData.nIntPrecioGECabina}
                disabled
              />
            </InfoSection>
          </div>
        </div>
      )}
      <section className="rounded-lg border border-dashed p-6 shadow-sm transition duration-300 ease-in-out backdrop-blur-sm mt-3 bg-white">
        <h2 className="text-lg font-semibold tracking-tight mb-2 flex items-center">
          <BadgeInfo className="mr-2 h-5 w-5" /> Calculo del precio de lista
        </h2>

        {/* Fórmula */}
        <div className="border-t border-gray-100 pt-3 gap-3 flex flex-col">
          <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
            Fórmula de precio de lista
          </h4>
          <div className="text-center overflow-x-auto">
            <BlockMath math={latexBlock} />
          </div>
          <section>
            <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Precio total del grupo electrógeno insonorizado
            </h4>
            <span className="text-xs font-normal">
              Se calcula sumando el precio de lista del grupo electrógeno más el
              precio de lista de la cabina.
            </span>
            <div className="text-center overflow-x-auto">
              <BlockMath math={latexTotalGeneratorSetSoundProof} />
            </div>
          </section>
        </div>
        <span className="text-xs font-normal">
          * Los precios son en Dolares Americanos <strong>(USD)</strong>
        </span>
      </section>
      <div className="mt-6 w-full flex justify-center">
        <Button onClick={handleSave} type="button" disabled={!data}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

const InfoSection = ({ title, children }) => (
  <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
    <h3 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const InfoItem = ({ label, value, onChange, disabled }) => (
  <div className="w-full">
    <FormInputText
      type="text"
      label={label}
      className="p-input w-full text-xs"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);
