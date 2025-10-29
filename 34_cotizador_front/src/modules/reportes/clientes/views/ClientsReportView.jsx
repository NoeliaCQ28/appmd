import { InputSearch } from "@components/custom/inputs/InputSearch";
import React, { useCallback, useEffect, useState } from "react";
import { QuoteTableSkeleton } from "../../../../components/skeletons/QuoteTableSkeleton";
import { ClientsReportTable } from "../components/ClientsReportTable";
import { useClientsReport } from "../../hooks/useClientsReport";
import { notify } from "../../../../utils/notifications";
import { ClientsReportFilters } from "../components/ClientsReportFilters";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "../../../../components/custom/buttons/Button";

const ClientsReportView = () => {
  const initialFilters = {
    source: "Todos",
    industry: "Todos",
  };

  const [filters, setFilters] = useState(initialFilters);

  const {
    clientsReport,
    isLoadingClientsReport,
    errorClientsReport,
    exportReport,
    isExporting,
  } = useClientsReport(filters);

  const [filteredData, setFilteredData] = useState(clientsReport);

  useEffect(() => {
    setFilteredData(clientsReport);
  }, [clientsReport]);

  React.useEffect(() => {
    if (errorClientsReport) {
      notify.error("Error al cargar el reporte de clientes");
    }
  }, [errorClientsReport]);

  const handleSearch = useCallback(
    (term) => {
      const filtered = clientsReport.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredData(filtered);
    },
    [clientsReport]
  );

  return (
    <div className="w-full px-4 py-2">
      <div className="pt-6 w-full flex flex-col gap-6">
        {/* Filtros */}
        <ClientsReportFilters
          initialFilters={initialFilters}
          onSubmit={(data) => setFilters(data)}
        />

        {/* Tabla */}
        <section className="flex flex-col gap-3">
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Busqueda */}
            <section className="space-y-4 flex flex-col sm:flex-row sm:space-x-4 sm:items-center sm:space-y-0 sm:justify-center">
              <InputSearch
                type={"text"}
                placeholder={"Buscar en el reporte..."}
                onSearch={handleSearch}
                className={
                  "p-2 outline-none w-full md:w-96 pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500"
                }
              />
            </section>
            {/* Boton Exportar */}
            <Button
              className="md:px-0"
              onClick={() => exportReport()}
              variant="tertiary"
              loading={isExporting}
            >
              <p> Exportar a Excel</p>
              <FileSpreadsheet className="w-5 h-5 ml-2" />
            </Button>
          </section>

          {isLoadingClientsReport || !filteredData ? (
            <QuoteTableSkeleton />
          ) : (
            <ClientsReportTable filteredData={filteredData} />
          )}
        </section>
      </div>
    </div>
  );
};

export default ClientsReportView;
