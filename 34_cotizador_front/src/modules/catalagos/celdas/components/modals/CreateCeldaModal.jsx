import { CreateCeldaForm } from "../forms/CreateCeldaForm";
import { Modal } from "../../../../../components/modals/Modal";

export const CreateCeldaModal = ({
  isOpen,
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={isEditMode ? "Editar Celda" : "Nueva Celda"}
    >
      <CreateCeldaForm
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
    </Modal>
  );
};
