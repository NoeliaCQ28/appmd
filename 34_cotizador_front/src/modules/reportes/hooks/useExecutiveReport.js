import { useQuery, useMutation } from "@tanstack/react-query";
import ReportsService from "../services/reportsService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { notify } from "@utils/notifications";

export const useExecutiveReport = (filters) => {
  const { getExecutiveReport, exportExecutiveReport } = ReportsService;

  const {
    data: executiveReport,
    isLoading: isLoadingExecutiveReport,
    error: errorExecutiveReport,
  } = useQuery({
    queryKey: [...QUERY_KEYS.reports.executiveReport, filters],
    queryFn: () => getExecutiveReport(filters),
  });

  const {
    mutate: exportReport,
    isPending: isExporting,
  } = useMutation({
    mutationFn: () => exportExecutiveReport(filters),
    onSuccess: () => {
      notify.success("Reporte exportado exitosamente");
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  return {
    executiveReport,
    isLoadingExecutiveReport,
    errorExecutiveReport,
    exportReport,
    isExporting,
  };
};
