import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RelativeDate } from "@components/custom/RelativeDate";
import { Tooltip } from "@components/Tooltip";

export const LogsTable = ({ logs, loading, onViewDetails }) => {
  // Skeleton templates for loading state
  const skeletonBodyTemplate = () => {
    return <Skeleton height="1.5rem" className="mb-2" />;
  };

  const skeletonActionTemplate = () => {
    return <Skeleton height="1.5rem" width="5rem" borderRadius="6px" />;
  };

  const skeletonUserTemplate = () => {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton height="1rem" width="7rem" />
        <Skeleton height="0.75rem" width="5rem" />
      </div>
    );
  };

  const skeletonEndpointTemplate = () => {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton height="1.25rem" width="4rem" borderRadius="4px" />
        <Skeleton height="0.875rem" width="10rem" />
      </div>
    );
  };

  const skeletonButtonTemplate = () => {
    return <Skeleton shape="circle" size="2rem" />;
  };

  // Mock data for skeleton rows
  const loadingData = Array.from({ length: 10 }, (_, i) => ({
    Auditoria_Id: i,
    skeleton: true,
  }));

  // Template for action column
  const actionBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonActionTemplate();

    const actionStyles = {
      LOGIN: "bg-green-50 text-green-700 border-green-200",
      LOGOUT: "bg-blue-50 text-blue-700 border-blue-200",
      CREATE: "bg-green-50 text-green-700 border-green-200",
      UPDATE: "bg-amber-50 text-amber-700 border-amber-200",
      DELETE: "bg-red-50 text-red-700 border-red-200",
      VIEW: "bg-gray-50 text-gray-700 border-gray-200",
    };

    const style = actionStyles[rowData.sAccion] || "bg-gray-50 text-gray-700 border-gray-200";

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style}`}>
        {rowData.sAccion}
      </span>
    );
  };

  // Template for success status
  const statusBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonBodyTemplate();

    return rowData.bExitoso ? (
      <span className="inline-flex items-center gap-1.5 text-green-700">
        <CheckCircle2 size={16} />
        <span className="text-xs font-medium">Exitoso</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-red-700">
        <XCircle size={16} />
        <span className="text-xs font-medium">Fallido</span>
      </span>
    );
  };

  // Template for date
  const dateBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonBodyTemplate();

    return (
      <RelativeDate 
        date={rowData.dtFechaHora} 
        className="text-sm text-gray-700"
      />
    );
  };

  // Template for user info
  const userBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonUserTemplate();

    return (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">
          {rowData.sUsuNombre || "-"}
        </span>
        <span className="text-xs text-gray-500">
          {rowData.sUsuLogin || "-"}
        </span>
      </div>
    );
  };

  // Template for endpoint
  const endpointBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonEndpointTemplate();

    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono bg-gray-100 text-gray-700 w-fit">
          {rowData.sMetodo}
        </span>
        <span className="font-mono text-xs text-gray-600 truncate max-w-xs">
          {rowData.sEndpoint}
        </span>
      </div>
    );
  };

  // Template for description
  const descriptionBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonBodyTemplate();

    const description = rowData.sAccionDescripcionHumana || "-";

    return (
      <Tooltip text={description}>
        <div className="max-w-md">
          <p className="text-sm text-gray-600 truncate">
            {description}
          </p>
        </div>
      </Tooltip>
    );
  };

  // Template for IP origin
  const ipBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonBodyTemplate();

    return (
      <span className="font-mono text-xs text-gray-600">
        {rowData.sIPOrigen || "-"}
      </span>
    );
  };

  // Template for actions
  const actionsBodyTemplate = (rowData) => {
    if (rowData.skeleton) return skeletonButtonTemplate();

    return (
      <button
        onClick={() => onViewDetails(rowData)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
        title="Ver detalles"
      >
        <Eye size={16} />
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
    >
      <AnimatePresence mode="wait">
        <DataTable
          value={loading ? loadingData : logs}
          loading={false}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          dataKey="Auditoria_Id"
          emptyMessage="No se encontraron registros"
          stripedRows
          size="small"
          responsiveLayout="scroll"
        >
        <Column
          field="Auditoria_Id"
          header="ID"
          sortable
          style={{ minWidth: "80px" }}
        />
        
        <Column
          field="sAccion"
          header="Acción"
          body={actionBodyTemplate}
          sortable
          style={{ minWidth: "120px" }}
        />
        
        <Column
          field="sAccionDescripcionHumana"
          header="Descripción"
          body={descriptionBodyTemplate}
          style={{ minWidth: "250px" }}
        />
        
        <Column
          header="Usuario"
          body={userBodyTemplate}
          sortable
          sortField="sUsuNombre"
          style={{ minWidth: "200px" }}
        />
        
        <Column
          header="Endpoint"
          body={endpointBodyTemplate}
          style={{ minWidth: "200px" }}
        />
        
        <Column
          field="sIPOrigen"
          header="IP Origen"
          body={ipBodyTemplate}
          style={{ minWidth: "150px" }}
        />
        
        <Column
          field="dtFechaHora"
          header="Fecha y Hora"
          body={dateBodyTemplate}
          sortable
          style={{ minWidth: "180px" }}
        />
        
        <Column
          field="bExitoso"
          header="Estado"
          body={statusBodyTemplate}
          sortable
          style={{ minWidth: "100px" }}
        />
        
        <Column
          header="Acciones"
          body={actionsBodyTemplate}
          exportable={false}
          style={{ minWidth: "100px" }}
        />
      </DataTable>
      </AnimatePresence>
    </motion.div>
  );
};
