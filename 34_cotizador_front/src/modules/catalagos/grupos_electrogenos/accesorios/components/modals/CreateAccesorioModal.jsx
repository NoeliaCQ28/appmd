import { Modal } from "../../../../../../components/modals/Modal";
import { CreateAccesorioForm } from "../forms/CreateAccesorioForm";

export const CreateAccesorioModal = ({
  isOpen,
  setIsOpen,
  isEditMode,
  selectedItem,
}) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={isEditMode ? "Editar Accesorio" : "Nuevo Accesorio"}
      footer={null}
      withBackground
    >
      <CreateAccesorioForm
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
    </Modal>
  );
};
