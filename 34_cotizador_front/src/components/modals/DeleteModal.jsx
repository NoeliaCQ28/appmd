import { Button } from "../custom/buttons/Button";
import { Modal } from "./Modal";

export const DeleteModal = ({ open, setOpen, onConfirm, message }) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Modal
      title="Confirmar Eliminación"
      open={open}
      setOpen={setOpen}
      footer={
        <>
          {" "}
          <Button type="button" onClick={handleConfirm}>
            Si, Eliminar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
        </>
      }
    >
      <span>¿Estás seguro de que deseas eliminar este elemento?</span>
      <span>{message}</span>
    </Modal>
  );
};
