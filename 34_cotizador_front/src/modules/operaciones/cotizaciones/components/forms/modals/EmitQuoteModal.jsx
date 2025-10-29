import { PDFViewer } from "@react-pdf/renderer";
import { Send, TriangleAlert } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../../../../../../components/custom/buttons/Button";
import { Modal } from "../../../../../../components/modals/Modal";
import useSingleQuote from "../../../hooks/useSingleQuote";
import { QuoteOfferPDF } from "../../QuoteOfferPDF";
import { ErrorComponent } from "../../../../../../components/error/ErrorComponent";

export const EmitQuoteModal = ({
  open,
  someModelsRequireDiscountApproval,
  setOpen,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const {
    quote,
    isLoading: isLoadingQuote,
    economicOffer,
    isLoadingEconomicOffer,
  } = useSingleQuote();

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Emitir Cotización"
      width="max-w-4xl"
      footer={
        <>
          <Button onClick={handleConfirm}>
            <Send className="w-4 h-4 mr-2" /> Sí, Emitir
          </Button>

          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </>
      }
    >
      ¿Estás seguro de que deseas emitir esta cotización?
      {someModelsRequireDiscountApproval && (
        <div className="mt-4 text-sm text-gray-600 flex items-center space-x-2">
          <TriangleAlert color="#c5a022" />
          <span>
            Recuerda que algunos modelos de esta cotización requieren aprobación
            de descuento.
          </span>
        </div>
      )}
      <section className="flex flex-col w-full">
        <ErrorBoundary fallbackRender={ErrorComponent}>
          {isLoadingQuote || isLoadingEconomicOffer ? (
            <div className="w-full h-[650px] mt-4 border-2 border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-8 w-full grid grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-200 rounded col-span-3"></div>
                  <div className="h-20 bg-gray-200 rounded col-span-3"></div>
                  <div className="h-20 bg-gray-200 rounded col-span-3"></div>
                </div>
              </div>
            </div>
          ) : (
            <PDFViewer
              className="w-full h-[650px] mt-4 border-2 border-gray-300 rounded-lg"
              scale={0.9}
            >
              <QuoteOfferPDF
                economicOffer={economicOffer}
                details={quote?.details}
              />
            </PDFViewer>
          )}
        </ErrorBoundary>
      </section>
    </Modal>
  );
};
