import { Modal } from "../../../../../../components/modals/Modal";
import { useCustomerStore } from "../../../stores/useCustomerStore";
import { ContactForm } from "../ContactForm";

export const ContactModal = ({
  isOpen,
  setIsOpen,
  selectedItem,
  customerId,
  isEditMode = false,
}) => {
  const { removeCustomerFromSAP } = useCustomerStore();

  return (
    <Modal
      open={isOpen}
      setOpen={() => {
        if (isOpen) {
          setIsOpen(false);
          removeCustomerFromSAP();
        } else {
          setIsOpen(true);
        }
      }}
      title={
        isEditMode ? "Editar datos del Contacto" : "Datos del Nuevo Contacto"
      }
      footer={null}
      withBackground
    >
      <ContactForm
        selectedItem={selectedItem}
        customerId={customerId}
        setIsOpen={setIsOpen}
        isEditMode={isEditMode}
      />
    </Modal>
  );
};
