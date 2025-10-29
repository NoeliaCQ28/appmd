import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../../../../components/modals/Modal";
import CombinationForm from "../forms/CombinationForm";

export const CombinationModal = ({
  isOpen,
  setIsOpen,
  selectedModels = [],
  setSelectedGeneratorSets,
  mode = "create", // "create" or "edit"
}) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);

  const isEditMode = mode === "edit" && selectedModels?.length > 0;
  const isMultipleModels = selectedModels?.length > 1;
  const currentModel = isEditMode ? selectedModels[currentModelIndex] : null;

  const handleNext = () => {
    if (currentModelIndex < selectedModels.length - 1) {
      setCurrentModelIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentModelIndex > 0) {
      setCurrentModelIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentModelIndex(0);
    isEditMode && setSelectedGeneratorSets([]);
  };

  const getModalTitle = () => {
    if (isEditMode) {
      if (isMultipleModels) {
        return `Editar Combinación (${currentModelIndex + 1}/${
          selectedModels.length
        })`;
      }
      return "Editar Combinación";
    }
    return "Nueva Combinación";
  };

  // Base styles inspired by shadcn/ui button variants (compact & elegant)
  const baseNavBtn =
    "inline-flex items-center gap-1.5 h-8 px-3 rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none";

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={getModalTitle()}
      withBackground
      width="max-w-4xl"
    >
      {/* Navigation for multiple models */}
      <div>
        {isEditMode && currentModel && (
          <p className="text-xl mt-1">
            <span className="font-semibold">{currentModel.Modelo}</span>
          </p>
        )}
      </div>

      {isEditMode && isMultipleModels && (
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentModelIndex === 0}
            className={`${baseNavBtn} ${
              currentModelIndex === 0
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-gray-200 text-blue-600 hover:bg-blue-50 active:bg-blue-100"
            }`}
          >
            <ArrowLeft size={18} />
            Anterior
          </button>

          <span className="text-lg font-semibold text-gray-800">
            {selectedModels[currentModelIndex]?.Modelo}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentModelIndex === selectedModels.length - 1}
            className={`${baseNavBtn} ${
              currentModelIndex === selectedModels.length - 1
                ? "bg-gray-100 border-gray-200 text-gray-400"
                : "bg-white border-gray-200 text-blue-600 hover:bg-blue-50 active:bg-blue-100"
            }`}
          >
            Siguiente
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <CombinationForm
        mode={mode}
        initialData={currentModel}
        onSuccess={() => {
          if (
            isEditMode &&
            isMultipleModels &&
            currentModelIndex < selectedModels.length - 1
          ) {
            handleNext();
          } else {
            handleClose();
          }
        }}
        onClose={handleClose}
      />
    </Modal>
  );
};
