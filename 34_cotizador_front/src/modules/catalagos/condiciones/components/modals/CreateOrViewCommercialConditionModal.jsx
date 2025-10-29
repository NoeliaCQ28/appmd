import { Modal } from "../../../../../components/modals/Modal";
import ViewModes from "../../../../../constants/ViewModes";
import { CondicionesForm } from "../forms/CondicionesForm";

export const CreateOrViewCommercialConditionModal = ({
  isOpen,
  setOpen,
  viewMode,
  selectedItem,
}) => {
  if (viewMode === ViewModes.EDIT) {
    throw new Error("Solo se permite Crear o Ver una Condición Comercial");
  }

  const title = ViewModes.isReadOnly(viewMode)
    ? "Condición Comercial"
    : "Crear Nueva Condición Comercial";

  return (
    <Modal
      open={isOpen}
      setOpen={setOpen}
      title={title}
      footer={null}
      withBackground
    >
      <CondicionesForm
        viewMode={viewMode}
        selectedItem={selectedItem}
        external={true}
        onCancelForm={() => setOpen(false)}
      />
    </Modal>
  );
};
