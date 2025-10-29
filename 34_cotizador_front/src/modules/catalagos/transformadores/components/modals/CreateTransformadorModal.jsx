import { CreateTransformadorForm } from "../forms/CreateTransformadorForm";
import { Modal } from "../../../../../components/modals/Modal";

export const CreateTransformadorModal = ({
  isOpen,
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={
        isEditMode
          ? "Editar Transformador"
          : "Nuevo Transformador"
      }
    >
      <CreateTransformadorForm
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
    </Modal>
  );
};
