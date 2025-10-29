import { Modal } from "../../../../../components/modals/Modal";
import { GeneratorSetModelForm } from "../forms/GeneratorSetModelForm";

export const AddNewGeneratorSetModelModal = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      title="Crear Nuevo Modelo de Grupo Electrógeno"
      open={isOpen}
      setOpen={setIsOpen}
      withBackground
      width="max-w-3xl"
    >
      <GeneratorSetModelForm setIsOpen={setIsOpen} />
    </Modal>
  );
};
