import React from "react";
import { toast } from "react-toastify";
import { CardResumen } from "../../../../../../components/CardResumen";
import { useCablesAddItemsStore } from "../../../hooks/useCablesAddItemsStore";
import { useCablesStore } from "../../../hooks/useCablesStore";
import useQuote from "../../../hooks/useQuote";
import { useResume } from "../../../hooks/useResume";
import { CablesForm } from "../CablesForm";
import { Modal } from "../../../../../../components/modals/Modal";

export const AddMoreCablesModal = ({
  isOpen,
  onClose,
  existingDetails,
  margin = 0,
  type,
}) => {
  const { cablesArray, addCable, clearCablesAdded } = useCablesAddItemsStore();
  const { addItemsDetailsMutate, isPendingAddItemsDetails } = useQuote();
  const { setDiscount, discount } = useCablesStore();
  const loadedDetailsRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      if (existingDetails && existingDetails.length > 0) {
        // Check if we've already loaded these specific details
        const detailsKey = existingDetails.map((d) => d.nCotDetItem).join(",");
        if (loadedDetailsRef.current !== detailsKey) {
          clearCablesAdded();
          existingDetails.forEach((detail) => {
            if (detail && detail.quote_extra_details) {
              const { quote_extra_details } = detail;

              const formattedCableData = {
                CableCantidad: Number(quote_extra_details.CableCantidad) || 0,
                CableCodigoSAP: quote_extra_details.CableCodigoSAP || "",
                CableDescripcion: quote_extra_details.CableDescripcion || "",
                CableDiasEntrega:
                  Number(quote_extra_details.CableDiasParaEntrega) || 0,
                CableId: Number(quote_extra_details.CableId) || 0,
                CableMarca: quote_extra_details.CableMarca || "",
                CableMargen: Number(quote_extra_details.CableMargen) || 0,
                CablePrecio: parseFloat(quote_extra_details.CablePrecio) || 0,
                CableTipo: quote_extra_details.CableTipo || "",
                operativeCosts: quote_extra_details.operativeCosts || {
                  shipping: { isPresent: false, amount: 0 },
                  startup: { isPresent: false, amount: 0 },
                },
              };

              addCable(formattedCableData);
            }
          });
          loadedDetailsRef.current = detailsKey;
        }
        setDiscount(margin);
      }
    } else {
      clearCablesAdded([]);
      setDiscount(0);
      loadedDetailsRef.current = null;
    }
  }, [isOpen, existingDetails, addCable, clearCablesAdded, setDiscount]);

  const quoteId = existingDetails[0]?.Cotizacion_Id || 0;
  const quoteDeatilsIds = existingDetails.map((detail) => detail.nCotDetItem);

  const { resume, isResumeAvailable } = useResume(cablesArray, type);

  const handleUpdate = () => {
    const payload = {
      quoteId: quoteId,
      quoteDeatilsIds: quoteDeatilsIds,
      margen_global: resume.discount,
      total: resume.total,
      details: cablesArray,
    };

    addItemsDetailsMutate(payload, {
      onSuccess: () => {
        onClose();
        clearCablesAdded([]);
      },
      onError: (error) => {
        toast.error("Error al agregar los items al detalle");
      },
    });
  };

  // Cancelar modal
  const handleCancel = () => {
    onClose();
    clearCablesAdded([]);
    setDiscount(0);
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
            className={`px-8 p-2 uppercase text-white rounded-lg transition-colors ${
              isPendingAddItemsDetails
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
            onClick={handleUpdate}
            disabled={isPendingAddItemsDetails}
          >
            {isPendingAddItemsDetails ? "Actualizando..." : "Actualizar"}
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
      <CablesForm isEditMode={true} />
      {isResumeAvailable && (
        <section>
          <CardResumen
            items={resume.items}
            total={resume.total}
            discount={resume.discount}
            marginPercentage={resume.marginPercentage || 0}
            isThroughput={resume.isThroughput || false}
          />
        </section>
      )}
    </Modal>
  );
};
