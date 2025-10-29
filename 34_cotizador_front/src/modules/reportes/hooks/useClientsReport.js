import { useQuery, useMutation } from "@tanstack/react-query";
import ReportsService from "../services/reportsService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { notify } from "@utils/notifications";

export const useClientsReport = (filters) => {
  const { getClientsReport, exportClientsReport } = ReportsService;

  const {
    data: clientsReport,
    isLoading: isLoadingClientsReport,
    error: errorClientsReport,
  } = useQuery({
    queryKey: [...QUERY_KEYS.reports.clientsReport, filters],
    queryFn: () => getClientsReport(filters),
  });

  const {
    mutate: exportReport,
    isPending: isExporting,
  } = useMutation({
    mutationFn: () => exportClientsReport(filters),
    onSuccess: () => {
      notify.success("Reporte exportado exitosamente");
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  return {
    clientsReport,
    isLoadingClientsReport,
    errorClientsReport,
    exportReport,
    isExporting,
  };
};
