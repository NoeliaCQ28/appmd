import { useQuery, useMutation } from "@tanstack/react-query";
import ReportsService from "../services/reportsService";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { notify } from "@utils/notifications";

export const useQuotesReport = (filters) => {
  const { getQuotesReport, exportQuotesReport } = ReportsService;

  // Format dates for API
  const formattedFilters = {
    ...filters,
    startDate: filters.startDate instanceof Date 
      ? filters.startDate.toISOString().split('T')[0] 
      : filters.startDate,
    endDate: filters.endDate instanceof Date 
      ? filters.endDate.toISOString().split('T')[0] 
      : filters.endDate,
  };

  const {
    data: quotesReport,
    isLoading: isLoadingQuotesReport,
    error: errorQuotesReport,
  } = useQuery({
    queryKey: [...QUERY_KEYS.reports.quotesReport, formattedFilters],
    queryFn: () => getQuotesReport(formattedFilters),
  });

  const {
    mutate: exportReport,
    isPending: isExporting,
  } = useMutation({
    mutationFn: () => exportQuotesReport(formattedFilters),
    onSuccess: () => {
      notify.success("Reporte exportado exitosamente");
    },
    onError: (error) => {
      notify.error(error);
    },
  });

  return {
    quotesReport,
    isLoadingQuotesReport,
    errorQuotesReport,
    exportReport,
    isExporting,
  };
};
