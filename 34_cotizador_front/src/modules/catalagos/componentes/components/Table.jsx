import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable } from "primereact/datatable";
import { Row } from "primereact/row";

export const Table = ({ filteredData }) => {
  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="PRODUCTO" rowSpan={2} />
        <Column header="MERCADO NACIONAL" colSpan={2} />
        <Column header="MERCADO INTERNACIONAL" colSpan={2} />
      </Row>
      <Row>
        <Column header="CABINA" />
        <Column header="ABIERTO" />
        <Column header="CABINA" />
        <Column header="ABIERTO" />
      </Row>
    </ColumnGroup>
  );

  return (
    <div className="pt-0 md:p-4 relative">
      <DataTable
        value={filteredData}
        tableStyle={{ minWidth: "50rem" }}
        headerColumnGroup={headerGroup}
        paginator
        rows={10}
        rowsPerPageOptions={getFilas(filteredData)}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
      >
        <Column field="producto" className="select-text" />
        <Column field="mercadoN.cabina" className="select-text" />
        <Column field="mercadoN.sinCabina" className="select-text" />
        <Column field="mercadoI.cabina" className="select-text" />
        <Column field="mercadoI.sinCabina" className="select-text" />
      </DataTable>
    </div>
  );
};
