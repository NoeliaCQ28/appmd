import { TransformadorForm } from "../TransformadorForm";
import { Modal } from "../../../../../../components/modals/Modal";
import { notify } from "../../../../../../utils/notifications";
import { useDetails } from "../../../hooks/useDetails";
import { useQuote } from "../../../hooks/v2/useQuote";

export const AddMoreTransformersModal = ({
  isOpen,
  onClose,
  existingDetails,
  type,
}) => {
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
        details: standardDetails?.filter(
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
  // Cancelar modal
  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      setOpen={(open) => !open && handleCancel()}
      title="Parámetros"
      width="max-w-[76rem]"
      footer={
        <>
          <button
            type="button"
            className="px-8 p-2 uppercase text-white rounded-lg transition-colors bg-green-600 hover:bg-green-700 cursor-pointer"
            onClick={handleUpdate}
          >
            Actualizar
          </button>
          <button
            type="button"
            className="bg-red-600 px-8 p-2 uppercase text-white rounded-lg cursor-pointer hover:bg-red-700 transition-colors"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </>
      }
    >
      <TransformadorForm isEditMode={false} isAppendMode={true} />
      {/* {isResumeAvailable && (
        <section>
          <CardResumen
            items={resume.items}
            total={resume.total}
            discount={resume.discount}
            isThroughput={resume.isThroughput || false}
          />
        </section>
      )} */}
    </Modal>
  );
};
