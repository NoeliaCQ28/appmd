import { CreateAccesorioForm } from "../forms/CreateAccesorioForm";
import { Modal } from "../../../../../../components/modals/Modal";

export const CreateAccesorioModal = ({ isOpen, setIsOpen, isEditMode, selectedItem }) => {
  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Datos del Nuevo Accesorio"
    >
      <CreateAccesorioForm setIsOpen={setIsOpen} isEditMode={isEditMode} selectedItem={selectedItem}/>
    </Modal>
  );
};
