import { Modal } from "../../../../../components/modals/Modal";
import { BulkDataUploadForm } from "../forms/BulkDataUploadForm";

export const BulkDataUploadModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal open={isOpen} setOpen={setIsOpen} title={"Carga Masiva de Datos"}>
      <BulkDataUploadForm />
    </Modal>
  );
};
