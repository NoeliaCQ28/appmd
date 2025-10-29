import { useQuery } from "@tanstack/react-query";
import ReportsService from "../services/reportsService";
import { QUERY_KEYS } from "../../../constants/queryKeys";

export const useCardResumeReport = () => {
  const { getCardResume } = ReportsService;

  const {
    data: cardResume,
    isLoading: isLoadingCardResume,
    error: errorCardResume,
  } = useQuery({
    queryKey: QUERY_KEYS.reports.cardResume,
    queryFn: getCardResume,
  });

  return {
    cardResume,
    isLoadingCardResume,
    errorCardResume,
  };
};
