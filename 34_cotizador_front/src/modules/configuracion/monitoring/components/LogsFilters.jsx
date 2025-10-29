import React from "react";
import { Button } from "@components/custom/buttons/Button";
import { DateInput } from "@components/custom/inputs/DateInput";
import { NumberInput } from "@components/custom/inputs/NumberInput";
import { Search, RotateCcw, Activity } from "lucide-react";
import { motion } from "framer-motion";

export const LogsFilters = ({
  refetchInterval,
  startDate,
  endDate,
  limit,
  onStartDateChange,
  onEndDateChange,
  onLimitChange,
  onApplyFilters,
  onResetFilters,
  isLoading,
  isAutoRefreshing,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
    >
      <div className="flex flex-col lg:flex-row gap-3 items-end">
        {/* Start Date */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label
            htmlFor="startDate"
            className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
          >
            Fecha Inicio
          </label>
          <DateInput
            value={startDate}
            onChange={onStartDateChange}
            placeholder="Seleccionar fecha"
            maxDate={endDate || new Date()}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label
            htmlFor="endDate"
            className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
          >
            Fecha Fin
          </label>
          <DateInput
            value={endDate}
            onChange={onEndDateChange}
            placeholder="Seleccionar fecha"
            minDate={startDate}
            maxDate={new Date()}
          />
        </div>

        {/* Limit */}
        <div className="flex flex-col gap-1.5 w-full lg:w-auto lg:min-w-[140px]">
          <label
            htmlFor="limit"
            className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider"
          >
            Registros
          </label>
          <NumberInput
            value={limit}
            onChange={onLimitChange}
            min={10}
            max={1000}
            step={10}
            showButtons
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={onApplyFilters}
            loading={isLoading}
            disabled={!startDate || !endDate || isLoading}
            className="!w-auto !px-6 !py-2.5 !h-auto"
          >
            <Search size={14} className="mr-1.5" />
            Buscar
          </Button>
          <Button
            onClick={onResetFilters}
            variant="secondary"
            disabled={isLoading}
            className="!w-auto !px-3 !py-2.5 !h-auto"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* Auto-refresh indicator */}
      {isAutoRefreshing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex items-center gap-2 text-xs text-gray-600"
        >
          <Activity size={14} className="text-blue-600 animate-pulse" />
          <span>Actualizando en tiempo real cada {refetchInterval / 1000} segundos</span>
        </motion.div>
      )}
    </motion.div>
  );
};
