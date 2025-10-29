import { Plus, SaveIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { useCellsStore } from "../../../hooks/useCellsStore";
import { CellAccesoriosForm } from "../CellAccesoriosForm";
import { CreateAccesorioModal } from "../../../../../catalagos/celdas/accesorios/components/modals/CreateAccesorioModal";
import { Modal } from "../../../../../../components/modals/Modal";

export const CellsAccesoriosModal = ({
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
  const { cellsAdded, addDetail } = useCellsStore();

  const detailsOfCurrentCell = React.useMemo(() => {
    // Verificar si estamos en modo edición
    if (isEditMode) {
      if (cellsAdded.some((cell) => cell.quote_extra_details)) {
        // Buscar la celda que tenga el CeldaId en quote_extra_details
        const cell = cellsAdded.find(
          (cell) => cell.quote_extra_details?.CeldaId === selectedItem?.celdaId
        );
        return cell?.otherComponents || [];
      }
    }

    if (isAppendMode) {
      if (cellsAdded.some((cell) => cell.CeldaId === selectedItem?.CeldaId)) {
        const cell = cellsAdded.find(
          (cell) => cell.CeldaId === selectedItem?.CeldaId
        );
        return cell?.details || [];
      }
    }

    return (
      cellsAdded?.find(
        (transformer) => transformer.CeldaId === selectedItem?.CeldaId
      )?.details || []
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellsAdded, selectedItem?.CeldaId]);

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
      <CellAccesoriosForm
        addDetail={addDetail}
        // detailsAdded={detailsOfCurrentCell}
        detailsAdded={components.length > 0 ? components : detailsOfCurrentCell}
        CeldaId={selectedItem?.CeldaId}
        addComponent={addComponent}
        removeComponent={removeComponent}
        isEditMode={components.length > 0 || isEditMode}
      />
      <CreateAccesorioModal
        isOpen={openCreateNewAccesorio}
        setIsOpen={setOpenCreateNewAccesorio}
        isEditMode={false}
        selectedItem={null} // Cambia esto si necesitas pasar un elemento seleccionado
      />
    </Modal>
  );
};
