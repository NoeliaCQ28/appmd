import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";
import { Button } from "../../../../../../components/custom/buttons/Button";

export const SendToSAPQuoteModal = ({ open, setOpen, onConfirm }) => {
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
              Confirmar Envio al ERP
            </DialogTitle>
            <DialogDescription className="mt-2 text-md text-gray-800">
              ¿Estás seguro de que deseas enviar esta cotización al ERP?
            </DialogDescription>
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-10 md:pt-9 md:flex-row justify-evenly">
              <Button onClick={handleConfirm}>Si, Enviar</Button>
              {/* <Button variant="destructive" onClick={() => setOpen(false)}>
                Rechazar
              </Button> */}
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
