import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { ErrorComponent } from "../../../../components/error/ErrorComponent";
import { useEditData } from "../hooks/useEditData";
import { useInfo } from "../hooks/useInfo";
import useModelsSearch from "../hooks/useModelsSearch";
import { PowerAlternatorInfo } from "./PowerAlternatorInfo";
import { AddNewAlternadorModal } from "./modals/AddNewAlternadorModal";

export const AlternatorInfo = ({ modelSelected }) => {
  const {
    alternatorInfo,
    editMutateAlternador,
    editMutatePowerAlternator,
    createMutatePowerAlternator,
    createMutateAlternador,
  } = useInfo({
    modelSelected,
  });
  const data = alternatorInfo?.[0];

  const { alternatorBrands } = useModelsSearch();

  const { editData, handleChange, handleSave } = useEditData(
    data,
    editMutateAlternador
  );

  const [openAddNewAlternadorModal, setOpenAddNewAlternadorModal] =
    React.useState(false);

  return (
    <div className="transition-all duration-300">
      <h2 className="text-2xl font-bold mb-3">{editData.sAltModelo}</h2>
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-5">
            {/* General Information */}
            <InfoSection title="Información General">
              <InfoItem
                label="Código ERP"
                value={editData.sAltCodigoSAP}
                onChange={(val) => handleChange("sAltCodigoSAP", val)}
              />

              <section>
                <label
                  htmlFor="AlternadorMarca_Id"
                  className="uppercase font-medium text-sm line-clamp-1"
                >
                  Marca
                </label>
                <select
                  className="p-input text-xs w-full bg-white text-black p-2 py-3 rounded-md border border-gray-300"
                  onChange={(e) => {
                    handleChange("AlternadorMarca_Id", e.target.value);

                    const alternatorFamily = alternatorBrands.find(
                      (brand) =>
                        brand.AlternadorMarca_Id === Number(e.target.value)
                    )?.sAltFamilia;

                    handleChange("sAltFamilia", alternatorFamily || "");
                  }}
                >
                  <option value="" disabled>
                    Seleccione una marca
                  </option>
                  {alternatorBrands &&
                    alternatorBrands?.map((brand) => (
                      <option
                        className="text-black text-sm cursor-pointer"
                        key={brand.AlternadorMarca_Id}
                        value={`${brand.AlternadorMarca_Id}`}
                        selected={
                          Number.parseInt(brand.AlternadorMarca_Id) ===
                          Number.parseInt(editData.MarcaAlternador_Id)
                        }
                      >
                        {brand.sAltMarca}{" "}
                        {brand?.sAltMarcaObservacion &&
                          ` - ${brand.sAltMarcaObservacion}`}
                      </option>
                    ))}
                </select>
              </section>
              <InfoItem
                label="Familia"
                value={editData.sAltFamilia}
                disabled
                onChange={(val) => handleChange("sAltFamilia", val)}
              />
              <InfoItem
                label="Sistema de Exitación"
                value={editData.sAltSistemaExitacion}
                onChange={(val) => handleChange("sAltSistemaExitacion", val)}
              />
              <InfoItem
                label="Aislamiento"
                value={editData.sAltAislamiento}
                onChange={(val) => handleChange("sAltAislamiento", val)}
              />
              <InfoItem
                label="Grado de Protección"
                value={editData.sAltGradoIP}
                onChange={(val) => handleChange("sAltGradoIP", val)}
              />
              <InfoItem
                label="Brida"
                value={editData.nAltBrida}
                onChange={(val) => handleChange("nAltBrida", val)}
              />
              <InfoItem
                label="Disco"
                value={editData.nAltDisco}
                onChange={(val) => handleChange("nAltDisco", val)}
              />
              <InfoItem
                label="Costo (USD)"
                value={editData.nAltCostoUSD}
                onChange={(val) => handleChange("nAltCostoUSD", val)}
              />
            </InfoSection>

            {/* Technical Specs */}
            <InfoSection title="Especificaciones Técnicas">
              <InfoItem
                label="Tarjeta AVR"
                value={editData.sAltTarjetaAVR}
                onChange={(val) => handleChange("sAltTarjetaAVR", val)}
              />
              <InfoItem
                label="Número de Hilos"
                value={editData.nAltNroHilos}
                onChange={(val) => handleChange("nAltNroHilos", val)}
              />
              <InfoItem
                label="Número de Paso"
                value={editData.sAltNroPaso}
                onChange={(val) => handleChange("sAltNroPaso", val)}
              />
            </InfoSection>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Physical Characteristics */}
            <InfoSection title="Características Físicas">
              <InfoItem
                label="Peso (Kg)"
                value={editData.nAltPesoKg}
                onChange={(val) => handleChange("nAltPesoKg", val)}
              />
            </InfoSection>

            {/* Standards and Certifications */}
            <InfoSection title="Normas y Certificaciones">
              <InfoItem
                label="Normas Técnicas"
                value={editData.sAltNormaTecnica}
                onChange={(val) => handleChange("sAltNormaTecnica", val)}
              />
            </InfoSection>
          </div>
        </div>
      )}

      {/* Power Alternator Info */}
      <ErrorBoundary fallbackRender={ErrorComponent}>
        {data && (
          <PowerAlternatorInfo
            data={data}
            editMutatePowerAlternator={editMutatePowerAlternator}
            createMutatePowerAlternator={createMutatePowerAlternator}
          />
        )}
      </ErrorBoundary>

      <div className="flex flex-col md:flex-row justify-center mt-6 gap-5">
        <Button type="button" onClick={handleSave}>
          Actualizar
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="md:w-fit"
          onClick={() => setOpenAddNewAlternadorModal(true)}
        >
          Agregar Alternador
        </Button>
      </div>

      <AddNewAlternadorModal
        createMutateAlternador={createMutateAlternador}
        isOpen={openAddNewAlternadorModal}
        setIsOpen={setOpenAddNewAlternadorModal}
        // Motor_Id={data.Motor_Id}
      />
    </div>
  );
};
const InfoSection = ({ title, children }) => (
  <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm max-h-[400px] overflow-y-auto ">
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
      className="p-input text-xs w-full"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);
