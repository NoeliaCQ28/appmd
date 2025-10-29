import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

export const ExecutiveReportTable = ({ filteredData }) => {
  return (
    <DataTable
      emptyMessage="No se encontraron cotizaciones"
      value={filteredData}
      tableStyle={{ minWidth: "50rem" }}
      paginator
      rows={10}
      rowsPerPageOptions={getFilas(filteredData)}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} - {last} de {totalRecords}"
    >
      <Column field="EjecutivoNombre" sortable header="EJECUTIVO" />
      <Column
        field="TotalDeCotizaciones"
        sortable
        header="TOTAL DE COTIZACIONES"
      />
      <Column field="TipoCotizacion" sortable header="TIPO DE COTIZACIÓN" />
      <Column field="Mercado" sortable header="MERCADO" />
      <Column field="Pais" sortable header="PAIS" />
      <Column field="TotalAcumuladoUSD" sortable header=" TOTAL ACUMULADO" />
    </DataTable>
  );
};
