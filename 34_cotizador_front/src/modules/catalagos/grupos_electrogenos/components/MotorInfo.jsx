import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { ErrorComponent } from "../../../../components/error/ErrorComponent";
import { useEditData } from "../hooks/useEditData";
import { useInfo } from "../hooks/useInfo";
import { PowerMotorInfo } from "./PowerMotorInfo";
import { AddNewMotorModal } from "./modals/AddNewMotorModal";

export const MotorInfo = ({ modelSelected }) => {
  const {
    motorInfo,
    editMutateMotor,
    editMutatePowerMotor,
    createMutatePowerMotor,
    createMutateMotor,
  } = useInfo({
    modelSelected,
  });
  const data = motorInfo?.[0] || {};

  const { editData, handleChange, handleSave } = useEditData(
    data,
    editMutateMotor
  );

  const [openAddNewMotorModal, setOpenAddNewMotorModal] = React.useState(false);

  return (
    <div className="rounded-lg transition-all duration-300">
      {data?.sMotModelo && (
        <h2 className="text-2xl font-bold mb-2">{editData.sMotModelo}</h2>
      )}

      {data?.sMotModelo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-5">
            <InfoSection title="Información General">
              <InfoItem
                label="Código ERP"
                value={editData.sMotCodigoSAP}
                onChange={(val) => handleChange("sMotCodigoSAP", val)}
              />
              <InfoItem
                label="Familia"
                value={editData.sMotFamilia}
                onChange={(val) => handleChange("sMotFamilia", val)}
              />
              <InfoItem
                label="Ciclo"
                value={editData.sMotCiclo}
                onChange={(val) => handleChange("sMotCiclo", val)}
              />
              <InfoItem
                label="Combustible"
                value={editData.sMotCombustible}
                onChange={(val) => handleChange("sMotCombustible", val)}
              />
              <InfoItem
                label="Normas Técnicas"
                value={editData.sMotNormasTecnicas}
                onChange={(val) => handleChange("sMotNormasTecnicas", val)}
              />
              <InfoItem
                label="Nivel de Emisión"
                value={editData.sMotNivelEmision}
                onChange={(val) => handleChange("sMotNivelEmision", val)}
              />
            </InfoSection>

            {/* Engine Specs */}
            <InfoSection title="Especificaciones">
              <InfoItem
                label="Cilindros"
                value={editData.sMotNoCilindros}
                onChange={(val) => handleChange("sMotNoCilindros", val)}
              />
              <InfoItem
                label="Aspiración"
                value={editData.sMotAspiracion}
                onChange={(val) => handleChange("sMotAspiracion", val)}
              />
              <InfoItem
                label="Sistema de Combustión"
                value={editData.sMotSisCombustion}
                onChange={(val) => handleChange("sMotSisCombustion", val)}
              />
              <InfoItem
                label="Sistema de Enfriamiento"
                value={editData.sMotSisEnfriamiento}
                onChange={(val) => handleChange("sMotSisEnfriamiento", val)}
              />
              <InfoItem
                label="Gobernación"
                value={editData.sMotSisGobernacion}
                onChange={(val) => handleChange("sMotSisGobernacion", val)}
              />
            </InfoSection>
          </div>

          <div className="space-y-5">
            <InfoSection title="Dimensiones y Características">
              <InfoItem
                label="Diámetro de pistón (mm)"
                value={editData.nMotDiametroPiston}
                onChange={(val) => handleChange("nMotDiametroPiston", val)}
              />
              <InfoItem
                label="Desplazamiento (mm)"
                value={editData.nMotDesplazamientoPiston}
                onChange={(val) =>
                  handleChange("nMotDesplazamientoPiston", val)
                }
              />
              <InfoItem
                label="Capacidad (cc)"
                value={editData.nMotCapacidad}
                onChange={(val) => handleChange("nMotCapacidad", val)}
              />
              <InfoItem
                label="Relación de compresión"
                value={editData.sMotRelCompresion}
                onChange={(val) => handleChange("sMotRelCompresion", val)}
              />
              <InfoItem
                label="Sistema eléctrico (V)"
                value={editData.nMotSisElectrico}
                onChange={(val) => handleChange("nMotSisElectrico", val)}
              />
            </InfoSection>

            <InfoSection title="Capacidades">
              <InfoItem
                label="Sistema de lubricación (litros)"
                value={editData.nMotCapSisLubricacion}
                onChange={(val) => handleChange("nMotCapSisLubricacion", val)}
              />
              <InfoItem
                label="Sistema de refrigeración (litros)"
                value={editData.nMotCapSisRefrigeracion}
                onChange={(val) => handleChange("nMotCapSisRefrigeracion", val)}
              />
            </InfoSection>
          </div>
        </div>
      )}

      {data?.sMotModelo && (
        <div className="mt-6 space-y-5">
          <h3 className="text-lg font-semibold">Consumo de Combustible</h3>

          <div className="border rounded-lg p-5">
            <div className="flex flex-col md:flex-row mb-3">
              <h4 className="text-orange-600 font-medium mb-2 md:mb-0 md:w-1/4">
                1800 RPM
              </h4>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                <ConsumptionItem
                  label="Stand By"
                  value={editData.nMotConsStandBy1800}
                  onChange={(val) => handleChange("nMotConsStandBy1800", val)}
                />
                <ConsumptionItem
                  label="Prime"
                  value={editData.nMotConsPrime1800}
                  onChange={(val) => handleChange("nMotConsPrime1800", val)}
                />
                <ConsumptionItem
                  label="Prime 75%"
                  value={editData.nMotConsPrime1800_75porc}
                  onChange={(val) =>
                    handleChange("nMotConsPrime1800_75porc", val)
                  }
                />
                <ConsumptionItem
                  label="Prime 50%"
                  value={editData.nMotConsPrime1800_50porc}
                  onChange={(val) =>
                    handleChange("nMotConsPrime1800_50porc", val)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              <h4 className="text-orange-600 font-medium mb-2 md:mb-0 md:w-1/4">
                1500 RPM
              </h4>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                <ConsumptionItem
                  label="Stand By"
                  value={editData.nMotConsStandBy1500}
                  onChange={(val) => handleChange("nMotConsStandBy1500", val)}
                />
                <ConsumptionItem
                  label="Prime"
                  value={editData.nMotConsPrime1500}
                  onChange={(val) => handleChange("nMotConsPrime1500", val)}
                />
                <ConsumptionItem
                  label="Prime 75%"
                  value={editData.nMotConsPrime1500_75porc}
                  onChange={(val) =>
                    handleChange("nMotConsPrime1500_75porc", val)
                  }
                />
                <ConsumptionItem
                  label="Prime 50%"
                  value={editData.nMotConsPrime1500_50porc}
                  onChange={(val) =>
                    handleChange("nMotConsPrime1500_50porc", val)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ErrorBoundary fallbackRender={ErrorComponent}>
        {data?.sMotModelo && (
          <PowerMotorInfo
            data={data}
            editMutatePowerMotor={editMutatePowerMotor}
            createMutatePowerMotor={createMutatePowerMotor}
          />
        )}
      </ErrorBoundary>

      <div className="flex justify-center mt-6 gap-5">
        {data?.sMotModelo && (
          <Button type="button" onClick={handleSave}>
            Actualizar
          </Button>
        )}

        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpenAddNewMotorModal(true)}
        >
          Agregar motor
        </Button>
      </div>

      <AddNewMotorModal
        createMutateMotor={createMutateMotor}
        isOpen={openAddNewMotorModal}
        setIsOpen={setOpenAddNewMotorModal}
        // Motor_Id={data.Motor_Id}
      />
    </div>
  );
};

export const InfoSection = ({ title, children }) => (
  <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm  overflow-y-auto">
    <h3 className="text-sm font-semibold mb-3 text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">
      {title}
    </h3>
    <div className="space-y-2 ">{children}</div>
  </section>
);

export const InfoItem = ({ label, value, onChange, disabled }) => (
  <div className="w-full">
    <FormInputText
      type="text"
      label={label}
      className="w-full p-input text-xs"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

const ConsumptionItem = ({ label, value, onChange }) => (
  <div className="bg-white rounded-lg p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
    <div className="text-xl font-semibold ">
      <FormInputText
        type="text"
        label={label}
        className="p-input w-28 text-xs"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);
