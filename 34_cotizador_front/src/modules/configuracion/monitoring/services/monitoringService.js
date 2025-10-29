import { isAxiosError } from "axios";
import { api } from "../../../../libs/axios";

const API_ENDPOINT = "/v1/audit/activity";

/**
 * Service for managing monitoring and audit logs
 * @namespace
 * @property {Function} fetchLogs - Fetches audit logs with filters
 * @example
 * // Fetch logs with filters
 * const logs = await monitoringService.fetchLogs({
 *   startDate: '2025-10-09',
 *   endDate: '2025-10-16',
 *   limit: 100
 * });
 */
const monitoringService = {
  /**
   * Fetches audit activity logs from the API
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date filter (YYYY-MM-DD)
   * @param {string} params.endDate - End date filter (YYYY-MM-DD)
   * @param {number} params.limit - Maximum number of records to return
   * @returns {Promise<Object>} Response with logs and metadata
   * @throws {Error} When API request fails
   */
  fetchLogs: async (params = {}) => {
    try {
      const { data: response } = await api.get(API_ENDPOINT, { params });

      if (!response.success) {
        throw new Error("Error al obtener los logs de auditoría");
      }

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al obtener los logs");
      }
      throw new Error("Ocurrió un error inesperado al obtener los logs de auditoría");
    }
  },
};

export default monitoringService;
