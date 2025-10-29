import { CreateCustomer } from "../../../../../catalagos/clientes/views/CreateCustomer";

import { Modal } from "../../../../../../components/modals/Modal";

export const AddClientModal = ({
  ClienteVisible,
  setClienteVisible,
  selectedItem,
  isEditMode,
  setCustomerContactEditMode,
  setCustomerSelected,
  customers,
  marketType,
  setMarketType,
}) => {
  return (
    <Modal
      open={ClienteVisible}
      setOpen={() => {
        if (ClienteVisible) {
          setClienteVisible(false);
          setCustomerContactEditMode(false);
        } else {
          setClienteVisible(true);
        }
      }}
      title={
        isEditMode ? "Editar datos del Cliente" : "Datos del Nuevo Cliente"
      }
      footer={null}
      withBackground
      width="max-w-7xl"
    >
      <CreateCustomer
        setVisibility={setClienteVisible}
        isEditMode={isEditMode}
        selectedEditItem={selectedItem}
        marketType={marketType}
        setMarketType={setMarketType}
        onCustomerCreated={(newCustomer) => {
          if (newCustomer) {
            setCustomerSelected(newCustomer);
          }
          // setClienteVisible(false);
        }}
        customersList={customers}
      />
    </Modal>
  );
};
