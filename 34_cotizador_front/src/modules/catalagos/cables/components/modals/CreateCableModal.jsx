import { CreateCableForm } from "../forms/CreateCableForm";
import { Modal } from "../../../../../components/modals/Modal";

export const CreateCableModal = ({
  isOpen,
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={isEditMode ? "Editar Cable" : "Nuevo Cable"}
    >
      <CreateCableForm
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
    </Modal>
  );
};
