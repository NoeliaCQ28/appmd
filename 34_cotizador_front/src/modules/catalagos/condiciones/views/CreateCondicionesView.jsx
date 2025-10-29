import { useLocation } from "react-router-dom";
import { CondicionesForm } from "../components/forms/CondicionesForm";
import ViewModes from "../../../../constants/ViewModes";

export const CreateCondicionesView = () => {
  const location = useLocation();
  const { state } = location;

  const selectedItem = state?.item || null;

  const isEditMode = selectedItem !== null;

  return (
    <div>
      <div className="w-full py-8 px-3 md:px-7">
        <h2 className="text-2xl font-semibold">
          {isEditMode ? "Editar Condición" : "Nueva Condición"}
        </h2>

        <CondicionesForm
          viewMode={isEditMode ? ViewModes.EDIT : ViewModes.CREATE}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  );
};
