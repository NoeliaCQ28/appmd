import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { TriangleAlert } from "lucide-react";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";

export const RequireApprovalDiscountOfModels = ({
  open,
  modelsWithApprovalDiscount,
  setOpen,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} as="div" className={"relative z-10"} onClose={setOpen}>
      <div className="fixed inset-0 bg-black/60 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className="w-full md:max-w-2xl m-10 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6"
          >
            <DialogTitle className="text-lg font-semibold">
              Aprobar Descuento de Grupos Electrogenos
            </DialogTitle>
            <DialogDescription className="mt-2 text-md text-gray-800 flex flex-col">
              <section>
                ¿Estás seguro de que deseas aprobar el descuento de los grupos
                electrogenos?
              </section>
              <ul className="space-y-4 mt-4">
                {modelsWithApprovalDiscount && modelsWithApprovalDiscount?.map((detail, index) => (
                  <li
                    key={index}
                    className="p-4 bg-amber-50 rounded-lg transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <TriangleAlert
                        className="mt-1 flex-shrink-0"
                        color="#c5a022"
                      />
                      <div className="flex flex-col space-y-2">
                        <h4 className="font-medium text-gray-900">
                          {detail.quote_extra_details.sModeloNombre}{" "}
                          {detail.quote_extra_details.sMotorNombre}{" "}
                          {detail.quote_extra_details.sAlternadorNombre}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <span>Precio original:</span>
                            <span className="font-semibold">
                              ${detail.quote_extra_details.nPrecioOriginal}
                            </span>
                            <span className="text-xs text-gray-500">
                              (Incluye componentes adicionales)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Descuento:</span>
                            <span className="font-semibold text-amber-600">
                              {detail.quote_extra_details.sDescuentoDescripcion}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Precio final:</span>
                            <span className="font-semibold text-green-600">
                              ${detail.quote_extra_details.nPrecioFinal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </DialogDescription>
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-10 md:pt-9 md:flex-row justify-evenly">
              <Button onClick={handleConfirm}>Si, Aprobar</Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
