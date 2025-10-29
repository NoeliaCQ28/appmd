import React, { useState } from "react";
import { LogsFilters } from "../components/LogsFilters";
import { LogsTable } from "../components/LogsTable";
import { LogDetailsDialog } from "../components/LogDetailsDialog";
import useMonitoring from "../hooks/useMonitoring";
import { notify } from "@utils/notifications";
import { ProgressSpinner } from "primereact/progressspinner";
import { Activity, Database, Calendar, TrendingUp, Wifi } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const REFETCH_INTERVAL = 10000; // 10 seconds

export const MonitoringView = () => {
  // Calculate default dates (last 7 days)
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start, end };
  };

  const { start: defaultStart, end: defaultEnd } = getDefaultDates();

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [limit, setLimit] = useState(100);
  const [enabled, setEnabled] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Format dates for API
  const formatDateForAPI = (date) => {
    if (!date) return null;
    return format(date, "yyyy-MM-dd");
  };

  const { logs, meta, isLoading, isFetching, error, refetch } = useMonitoring({
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate),
    limit,
    enabled,
    refetchInterval: enabled ? REFETCH_INTERVAL : false, // Auto-refresh every 10 seconds when enabled
  });

  // Handle filter application
  const handleApplyFilters = () => {
    if (!startDate || !endDate) {
      notify.error("Por favor selecciona ambas fechas");
      return;
    }

    if (startDate > endDate) {
      notify.error("La fecha de inicio no puede ser mayor a la fecha de fin");
      return;
    }

    setEnabled(true);
    refetch();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    const { start, end } = getDefaultDates();
    setStartDate(start);
    setEndDate(end);
    setLimit(100);
    setEnabled(false);
  };

  // Handle view details
  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDialogVisible(true);
  };

  // Show error notification
  React.useEffect(() => {
    if (error) {
      notify.error(error);
    }
  }, [error]);

  // Stats card component with animation
  const StatsCard = ({ icon: Icon, label, value, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <Icon size={20} className="text-gray-600" />
        </motion.div>
        <div>
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-semibold text-gray-900 mt-0.5"
          >
            {value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full px-4 py-2">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Monitoreo de Sistema
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Logs de auditoría en tiempo real
              </p>
            </div>
          </div>

          {/* Live indicator */}
          {enabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-500 rounded-full"
              />
              <span className="text-xs font-medium text-green-700">
                En vivo
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="w-full space-y-4">
        {/* Filters */}
        <LogsFilters
          refetchInterval={REFETCH_INTERVAL}
          startDate={startDate}
          endDate={endDate}
          limit={limit}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onLimitChange={setLimit}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          isLoading={isFetching}
          isAutoRefreshing={enabled && !isLoading}
        />

        {/* Stats Cards */}
        <AnimatePresence mode="wait">
          {enabled && meta && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-3"
            >
              <StatsCard
                icon={Database}
                label="Total"
                value={meta.count || 0}
                delay={0}
              />
              <StatsCard
                icon={Calendar}
                label="Inicio"
                value={
                  meta.startDate
                    ? format(new Date(meta.startDate), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "-"
                }
                delay={0.1}
              />
              <StatsCard
                icon={Calendar}
                label="Fin"
                value={
                  meta.endDate
                    ? format(new Date(meta.endDate), "dd/MM/yyyy", {
                        locale: es,
                      })
                    : "-"
                }
                delay={0.2}
              />
              <StatsCard
                icon={TrendingUp}
                label="Límite"
                value={meta.limit || 0}
                delay={0.3}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence mode="wait">
          {!enabled && !isLoading && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-lg p-12"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="p-3 bg-gray-100 rounded-full mb-4"
                >
                  <Activity size={48} className="text-gray-400" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Configura los filtros para comenzar
                </h3>
                <p className="text-sm text-gray-600 max-w-md">
                  Los logs se actualizarán automáticamente cada{" "}
                  {REFETCH_INTERVAL / 1000} segundos
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && enabled && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-lg p-12"
            >
              <div className="flex flex-col items-center justify-center">
                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                <p className="mt-4 text-sm text-gray-600">
                  Cargando logs de auditoría...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logs Table */}
        <AnimatePresence mode="wait">
          {enabled && !isLoading && (
            <LogsTable
              key="table"
              logs={logs}
              loading={isFetching}
              onViewDetails={handleViewDetails}
            />
          )}
        </AnimatePresence>

        {/* Details Dialog */}
        <LogDetailsDialog
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          logData={selectedLog}
        />
      </div>
    </div>
  );
};
