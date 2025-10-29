import { Modal } from "../../../../../components/modals/Modal";
import { CreateUserForm } from "../forms/CreateUserForm";

export const CreateUserModal = ({
  isOpen,
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      withBackground
      title={isEditMode ? "Editar usuario" : "Nuevo usuario"}
    >
      <CreateUserForm
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
    </Modal>
  );
};
