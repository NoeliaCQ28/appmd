import { useQuery } from "@tanstack/react-query";
import monitoringService from "../services/monitoringService";

const QUERY_KEY = "monitoring-logs";

/**
 * Custom hook for managing monitoring and audit logs with auto-refresh
 * @param {Object} params - Query parameters
 * @param {string} params.startDate - Start date filter
 * @param {string} params.endDate - End date filter
 * @param {number} params.limit - Maximum number of records
 * @param {boolean} params.enabled - Whether the query should run
 * @param {number} params.refetchInterval - Auto-refetch interval in milliseconds (default: 10000)
 * @returns {Object} Query result with logs data
 */
const useMonitoring = ({ 
  startDate, 
  endDate, 
  limit, 
  enabled = true,
  refetchInterval = 10000 // 10 seconds default
}) => {
  const { fetchLogs } = monitoringService;

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: [QUERY_KEY, { startDate, endDate, limit }],
    queryFn: () => fetchLogs({ startDate, endDate, limit }),
    enabled,
    staleTime: 10000, // 10 seconds
    refetchInterval: enabled ? refetchInterval : false, // Auto-refetch when enabled
    refetchIntervalInBackground: false, // Don't refetch when tab is not active
  });

  return {
    logs: data?.logs || [],
    meta: data?.meta || null,
    isLoading,
    isFetching,
    error,
    refetch,
  };
};

export default useMonitoring;
