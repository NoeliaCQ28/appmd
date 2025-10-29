import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../../../../components/custom/buttons/Button";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { useEditData } from "../hooks/useEditData";

export const PowerMotorSingleInfo = ({ motorInfo, editMutatePowerMotor }) => {
  const { editData, handleChange, handleSave } = useEditData(
    motorInfo,
    editMutatePowerMotor
  );

  return (
    <div className="border rounded-lg p-5 bg-white">
      <div className="flex flex-col md:flex-row mb-3">
        <h4 className="text-orange-600 font-medium mb-2 md:mb-0 md:w-1/4">
          {motorInfo.RPM} RPM
        </h4>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
          <ConsumptionItem
            label="Stand By"
            value={editData.StandBy}
            onChange={(val) => handleChange("StandBy", val)}
          />
          <ConsumptionItem
            label="Prime"
            value={editData.Prime}
            onChange={(val) => handleChange("Prime", val)}
          />
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
        </div>
      </div>
      <section className="rounded-lg p-5 flex items-center justify-center gap-6">
        <Button onClick={handleSave}>
          Actualizar
          <Edit2 className="ml-2" width={14} height={14} />
        </Button>
        <Button variant="destructive" onClick={() => {}} disabled>
          Eliminar
          <Trash2 className="ml-2" width={14} height={14} />
        </Button>
      </section>
    </div>
  );
};

const ConsumptionItem = ({ label, value, onChange }) => (
  <div className="bg-white rounded-lg p-3 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
    <div className="text-xl font-semibold-600">
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
