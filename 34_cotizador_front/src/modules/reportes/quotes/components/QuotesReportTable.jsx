import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { RelativeDate } from "@components/custom/RelativeDate";

export const QuotesReportTable = ({ filteredData }) => {
  const dateBodyTemplate = (rowData, field) => {
    return <RelativeDate date={rowData[field]} />;
  };

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
      <Column
        field="NumeroDeCotizacion"
        sortable
        header="NÚMERO DE COTIZACIÓN"
      />
      <Column
        field="TipoDeCotizacion"
        sortable
        header="TIPO DE COTIZACIÓN"
      />
      <Column field="TipoDeMercado" sortable header="TIPO DE MERCADO" />
      <Column
        field="FechaYHoraBorrador"
        sortable
        header="FECHA Y HORA BORRADOR"
        body={(rowData) => dateBodyTemplate(rowData, "FechaYHoraBorrador")}
      />
      <Column
        field="FechaYHoraEmision"
        sortable
        header="FECHA Y HORA EMISIÓN"
        body={(rowData) => dateBodyTemplate(rowData, "FechaYHoraEmision")}
      />
      <Column
        field="FechaYHoraPedido"
        sortable
        header="FECHA Y HORA PEDIDO"
        body={(rowData) => dateBodyTemplate(rowData, "FechaYHoraPedido")}
      />
      <Column field="DiasDeRespuesta" sortable header="DÍAS DE RESPUESTA" />
    </DataTable>
  );
};
