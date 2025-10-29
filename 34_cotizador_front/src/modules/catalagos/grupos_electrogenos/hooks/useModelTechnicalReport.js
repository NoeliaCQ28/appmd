import { pdf } from "@react-pdf/renderer";
import { useQueries } from "@tanstack/react-query";
import React from "react";
import { toast } from "react-toastify";
import { FichaPdf } from "../../../operaciones/fichas/components/FichaPdf";
import generatorSetService from "../services/generatorSetService";

export const useModelTechnicalReport = ({ modelsSelected = [] }) => {
  const [popupWarningShown, setPopupWarningShown] = React.useState(false);

  const technicalReportsQueries = useQueries({
    queries: modelsSelected.map((model) => ({
      queryKey: ["technical-report", model.IntegradoraId],
      queryFn: () => generatorSetService.getTechnicalReport({ model }),
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!model && !!model.IntegradoraId,
    })),
  });

  const technicalReports = technicalReportsQueries
    .map((query) => query.data)
    .filter(Boolean);

  const openTechnicalReports = React.useCallback(async () => {
    if (!technicalReports.length) return;

    for (const report of technicalReports) {
      const blob = await pdf(
        React.createElement(FichaPdf, { ficha: report })
      ).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      const newWindow = window.open(blobUrl, "_blank");
      if (newWindow === null || typeof newWindow === "undefined") {
        if (!popupWarningShown) {
          alert(
            "Por favor, active las ventanas emergentes (popups) en su navegador para ver los archivos PDF."
          );
          setPopupWarningShown(true);
        }
        break; // Detener si se bloquean las ventanas emergentes
      }
    }
  }, [technicalReports, popupWarningShown]);

  return { openTechnicalReports };
};
