import { Plus, SaveIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { CreateAccesorioModal } from "../../../../../catalagos/transformadores/accesorios/components/modals/CreateAccesorioModal";
import { useTransformersStore } from "../../../hooks/useTransformersStore";
import { TransformadorAccesoriosForm } from "../TransformadorAccesoriosForm";
import { Modal } from "../../../../../../components/modals/Modal";

export const TransformadorAccesoriosModal = ({
  open,
  setOpen,
  selectedItem,
  components = [],
  addComponent = null,
  removeComponent = null,
  clearAll = null,
  isEditMode = false,
  isAppendMode = false,
}) => {
  const { transformersAdded, addDetail } = useTransformersStore();

  const detailsOfCurrentTransformer = React.useMemo(() => {
    // Verificar si estamos en modo edición

    if (isEditMode) {
      if (
        transformersAdded.some((transformer) => transformer.quote_extra_details)
      ) {
        // Buscar el transformador que tenga el TransformadorId en quote_extra_details
        const transformer = transformersAdded.find(
          (transformer) =>
            transformer.quote_extra_details?.TransformadorId ===
            selectedItem?.TransformadorId
        );
        return transformer?.otherComponents || [];
      }
    }

    if (isAppendMode) {
      if (
        transformersAdded.some(
          (t) => t.TransformadorId === selectedItem?.TransformadorId
        )
      ) {
        const transformer = transformersAdded.find(
          (t) => t.TransformadorId === selectedItem?.TransformadorId
        );
        return transformer?.details || [];
      }
    }

    return (
      transformersAdded?.find(
        (transformer) =>
          transformer.TransformadorId === selectedItem?.TransformadorId
      )?.details || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformersAdded, selectedItem?.TransformadorId]);

  const [openCreateNewAccesorio, setOpenCreateNewAccesorio] =
    React.useState(false);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Accesorios"
      actions={[
        <Button
          key="add-accessory"
          onClick={() => setOpenCreateNewAccesorio(true)}
        >
          Agregar <Plus className="ml-2" />
        </Button>,
      ]}
      footer={
        <>
          <Button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            <SaveIcon className="mr-2" />
            Guardar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancelar
          </Button>
        </>
      }
    >
      <TransformadorAccesoriosForm
        addDetail={addDetail}
        detailsAdded={
          components.length > 0 ? components : detailsOfCurrentTransformer
        }
        TransformadorId={selectedItem?.TransformadorId}
        addComponent={addComponent}
        removeComponent={removeComponent}
        isEditMode={components.length > 0 || isEditMode}
      />
      <CreateAccesorioModal
        isOpen={openCreateNewAccesorio}
        setIsOpen={setOpenCreateNewAccesorio}
        isEditMode={false}
        selectedItem={null}
      />
    </Modal>
  );
};
