import { Button } from "@components/custom/buttons/Button.jsx";
import { Dialog, DialogPanel } from "@headlessui/react";
import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
export const DownloadQuoteReportModal = ({
  open,
  setOpen,
  technicalReport,
}) => {
  const handleGenerateTechnicalForms = () => {
    const integradoraIds = technicalReport.map((tr) => {
      const integradora = tr.integradora;
      const id = integradora[0].IntegradoraID;

      return id;
    });

    try {
      integradoraIds.forEach((id) => {
        const newWindow = window.open(`/fichas/pdf/${id}`, "_blank");
        if (newWindow === null || typeof newWindow === "undefined") {
          alert(
            "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
          );
          return;
        }
      });
    } catch (error) {
      alert(
        "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
      );
    }
  };

  return (
    <Dialog open={open} as="div" className={"relative z-10"} onClose={setOpen}>
      <div className="fixed inset-0 bg-black/60 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className="w-full md:max-w-2xl m-10 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-6"
          >
            <div>
              <h2 className="font-bold text-xl text-center">
                Reporte de Cotización
              </h2>
              <section className="flex flex-col space-y-3 [&_section]:space-y-3">
                <section>
                  <h5 className="text-lg font-semibold">Cotización</h5>
                  <Button className="w-fit gap-3">
                    <Link to={"#"}>Generar PDF</Link>

                    <FaFilePdf size={20} />
                  </Button>
                </section>
                <section>
                  <h5 className="text-lg font-semibold">Ficha(s) Técnica(s)</h5>
                  <Button
                    className="w-fit gap-3"
                    onClick={handleGenerateTechnicalForms}
                  >
                    Generar fichas tecnicas
                    <FaFilePdf size={20} />
                  </Button>
                </section>
              </section>
            </div>
            <section action="#">
              <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-10 md:py-7 md:flex-row">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </section>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
