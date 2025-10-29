import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

export const ClientsReportTable = ({ filteredData }) => {
  return (
    <DataTable
      emptyMessage="No se encontraron clientes"
      value={filteredData}
      tableStyle={{ minWidth: "50rem" }}
      paginator
      rows={10}
      rowsPerPageOptions={getFilas(filteredData)}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} - {last} de {totalRecords}"
    >
      <Column
        field="ClienteNombre"
        sortable
        header="CLIENTE"
      />
      <Column
        field="Procedencia"
        sortable
        header="PROCEDENCIA"
      />
      <Column
        field="Rubro"
        sortable
        header="RUBRO"
      />
      <Column
        field="CantidadContactos"
        sortable
        header="CONTACTOS"
      />
      <Column
        field="CantidadCotizacionesBorrador"
        sortable
        header="COTIZACIONES BORRADOR"
      />
      <Column
        field="CantidadCotizacionesEmitidas"
        sortable
        header="COTIZACIONES EMITIDAS"
      />
      <Column
        field="CantidadCotizacionesAPedido"
        sortable
        header="COTIZACIONES A PEDIDO"
      />
    </DataTable>
  );
};
