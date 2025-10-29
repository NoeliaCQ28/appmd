import React from "react";
import { Modal } from "../../../../../../components/modals/Modal";
import { CeldasForm } from "../CeldasForm";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { notify } from "../../../../../../utils/notifications";
import { useQuote } from "../../../hooks/v2/useQuote";
import { useDetails } from "../../../hooks/useDetails";

export const AddMoreCellsModal = ({
  isOpen,
  onClose,
  existingDetails,
  type,
  margin,
}) => {
  const handleCancel = () => {
    onClose();
    //   clearGeneratorSetsAdded();
  };
  const handleSetOpen = (value) => {
    if (!value) handleCancel();
  };

  const { addDetailsMutate, isAddDetailsPending } = useQuote();

  const { isDetailsAvailable, standardDetails } = useDetails();

  const quoteId = existingDetails[0]?.Cotizacion_Id || 0;

  const handleUpdate = () => {
    if (!isDetailsAvailable) {
      notify.error("No hay detalles disponibles para agregar.");
      return;
    }

    addDetailsMutate(
      {
        quoteId,
        details: standardDetails.filter(
          (d) => d?.quote_extra_details?._meta?.mode === "append"
        ),
      },
      {
        onSuccess: () => {
          onClose();
          //clearGeneratorSetsAdded();
        },
        onError: (error) => {
          notify.error(error.message || "Error al agregar los detalles.");
        },
      }
    );
  };
  return (
    <Modal
      open={isOpen}
      setOpen={handleSetOpen}
      title="Agregar Celdas"
      width="max-w-[70rem]"
      footer={
        <>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isAddDetailsPending || !isDetailsAvailable}
            variant="tertiary"
          >
            {isAddDetailsPending ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button type="button" onClick={handleCancel} variant="destructive">
            Cancelar
          </Button>
        </>
      }
      withBackground
    >
      <CeldasForm isAppendMode={true} />
    </Modal>
  );
};
