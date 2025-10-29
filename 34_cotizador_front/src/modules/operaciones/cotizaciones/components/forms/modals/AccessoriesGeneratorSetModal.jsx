import { Dialog, DialogPanel } from "@headlessui/react";
import { Plus, SaveIcon, X } from "lucide-react";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { CreateAccesorioModal } from "../../../../../catalagos/grupos_electrogenos/accesorios/components/modals/CreateAccesorioModal";
import { AccessoriesGeneratorSetList } from "../AccessoriesGeneratorSetList";
import { Modal } from "../../../../../../components/modals/Modal";

export const AccessoriesGeneratorSetModal = ({
  open,
  setOpen,
  components,
  addComponent,
  // commitComponents,
  removeComponent,
  clearAll,
  integradoraId,
}) => {
  // const [stagingComponents, setStagingComponents] = React.useState(components);

  // React.useEffect(() => {
  //   setStagingComponents(components);
  // }, [components]);

  // const [stagingRemovedComponents, setStagingRemovedComponents] =
  //   React.useState([]);
  const [openCreateNewOptional, setOpenCreateNewOptional] =
    React.useState(false);

  // React.useEffect(() => {
  //   setStagingRemovedComponents([]);
  // }, [components]);

  // const addComponentToStaging = (newComponent) => {
  //   const isAlreadyAdded = stagingComponents.some(
  //     (c) => c.id === newComponent.id
  //   );

  //   if (isAlreadyAdded) {
  //     const payload = stagingComponents.filter((c) => c.id !== newComponent.id);

  //     setStagingComponents(payload);

  //     addToRemoveComponents(newComponent);
  //   } else {
  //     setStagingComponents([...stagingComponents, newComponent]);
  //   }
  // };

  // const addToRemoveComponents = (component) => {
  //   setStagingRemovedComponents([...stagingRemovedComponents, component]);
  // };

  const handleCancel = () => {
    // setStagingComponents(components);
    // setStagingRemovedComponents([]);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Accesorios de Grupos Electrógenos"
      actions={[
        <Button
          key="add-accessory"
          onClick={() => setOpenCreateNewOptional(true)}
        >
          Agregar <Plus className="ml-2" />
        </Button>,
      ]}
      footer={
        <>
          <Button
            type="button"
            onClick={() => {
              // commitComponents(
              //   stagingComponents,
              //   stagingRemovedComponents
              // );
              handleCancel();
            }}
          >
            <SaveIcon className="mr-2" />
            Guardar
          </Button>
          {/* Puedes eliminar o modificar el botón Cancelar si no quieres que cierre el modal */}
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancelar
          </Button>
        </>
      }
    >
      <AccessoriesGeneratorSetList
        components={components}
        addComponent={addComponent}
        removeComponent={removeComponent}
        integradoraId={integradoraId}
      />
      <CreateAccesorioModal
        isOpen={openCreateNewOptional}
        setIsOpen={setOpenCreateNewOptional}
        isEditMode={false}
      />
    </Modal>
  );
};
