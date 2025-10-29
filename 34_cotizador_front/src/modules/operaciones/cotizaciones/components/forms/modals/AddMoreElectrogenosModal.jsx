import { toast } from "react-toastify";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { Modal } from "../../../../../../components/modals/Modal";
import { useDetails } from "../../../hooks/useDetails";
import { useQuote } from "../../../hooks/v2/useQuote";
import { useGeneratorSetStore } from "../../../store/v2/useGeneratorSetStore";
import { ElectrogenosForm } from "../ElectrogenosForm";

export const AddMoreElectrogenosModal = ({
  isOpen,
  onClose,
  existingDetails,
  marketId,
}) => {
  const { clearGeneratorSetsAdded } = useGeneratorSetStore();
  const { addDetailsMutate, isAddDetailsPending } = useQuote();

  const { isDetailsAvailable, standardDetails } = useDetails();

  const quoteId = existingDetails[0]?.Cotizacion_Id || 0;

  const handleUpdate = () => {
    if (!isDetailsAvailable) {
      toast.error("No hay detalles disponibles para agregar.");
      return;
    }

    addDetailsMutate(
      { quoteId, details: standardDetails },
      {
        onSuccess: () => {
          onClose();
          clearGeneratorSetsAdded();
        },
        onError: (error) => {
          toast.error(error.message || "Error al agregar los detalles.");
        },
      }
    );
  };

  const handleCancel = () => {
    onClose();
    clearGeneratorSetsAdded();
  };

  // When modal's internal close (X) is used, mimic cancel logic
  const handleSetOpen = (value) => {
    if (!value) handleCancel();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleSetOpen}
      title="Agregar Grupos Electrógenos"
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
      <ElectrogenosForm isAppendMode={true} marketId={marketId} />
    </Modal>
  );
};
