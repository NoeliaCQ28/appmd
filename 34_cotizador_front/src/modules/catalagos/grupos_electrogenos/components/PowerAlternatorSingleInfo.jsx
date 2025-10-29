import { Edit2, Trash2 } from "lucide-react";
import { InputText } from "primereact";
import React from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { useEditData } from "../hooks/useEditData";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import site from "../../../../config/site";

export const PowerAlternatorSingleInfo = ({
  alternatorInfo,
  editMutatePowerAlternator,
}) => {
  const { editData, handleChange, handleSave } = useEditData(
    alternatorInfo,
    editMutatePowerAlternator
  );

  return (
    <div className="rounded-lg p-5 bg-white">
      <div className="flex flex-col md:flex-row mb-3">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-7 gap-3">
          <ConsumptionItem
            label="Frecuencia"
            value={editData.Frecuencia}
            onChange={(val) => handleChange("Frecuencia", val)}
          />
          <ConsumptionItem
            label="Fases"
            value={editData.Fases}
            onChange={(val) => handleChange("Fases", val)}
          />
          <ConsumptionItem
            label="Voltaje"
            value={editData.Voltaje}
            onChange={(val) => handleChange("Voltaje", val)}
          />
          <ConsumptionItem
            label={`Prime ${site.powerUnits.kilowatt}`}
            value={editData.Prime_KW}
            onChange={(val) => handleChange("Prime_KW", val)}
          />
          <ConsumptionItem
            label={`Prime ${site.powerUnits.kilovoltAmpere}`}
            value={editData.Prime_KVA}
            onChange={(val) => handleChange("Prime_KVA", val)}
          />
          <ConsumptionItem
            label={`StandBy ${site.powerUnits.kilowatt}`}
            value={editData.Standby_KW}
            onChange={(val) => handleChange("Standby_KW", val)}
          />
          <ConsumptionItem
            label={`StandBy ${site.powerUnits.kilovoltAmpere}`}
            value={editData.SandtBy_KVA}
            onChange={(val) => handleChange("SandtBy_KVA", val)}
          />
        </div>
      </div>
      <section className="rounded-lg p-5 flex items-center justify-center gap-6">
        <Button onClick={handleSave}>
          Actualizar
          <Edit2 className="ml-2" width={14} height={14} />
        </Button>
        <Button variant="destructive" onClick={() => {}} disabled>
          Eliminar
        </Button>
      </section>
    </div>
  );
};

const ConsumptionItem = ({ label, value, onChange }) => (
  <div className="bg-white rounded-lg p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
    <div className="text-xl font-semibold">
      <FormInputText
        type="text"
        label={label}
        className="p-input w-18 text-xs"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);
