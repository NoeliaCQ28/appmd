import { CeilOperaciones } from "@components/CeilOperaciones";
import { DeleteModal } from "@components/modals/DeleteModal";
import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import useCustomer from "../hooks/useCustomer";
import { CustomerOrigin } from "./forms/customerOrigin";

export const Table = ({
  filteredData,
  setIsEditMode,
  setSelectedEditItem,
  selectedEditItem,
  setVisibility,
}) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const { deleteMutate } = useCustomer();

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutate({ id: selectedItem.Cliente_Id });
      setSelectedItem(null);
    }
  };
  const operaciones = (rowData) => {
    return (
      <div className="flex space-x-2">
        <CeilOperaciones>
          {" "}
          <MdModeEdit
            color="green"
            size={20}
            onClick={() => {
              setIsEditMode(true);
              setVisibility(true);
              setSelectedEditItem(rowData);
            }}
          />
        </CeilOperaciones>
        <CeilOperaciones>
          {" "}
          <RiDeleteBinLine
            color="red"
            size={20}
            onClick={() => openModalDelete(rowData)}
          />
        </CeilOperaciones>
      </div>
    );
  };

  return (
    <div className="pt-0 md:p-4 relative">
      <div className="w-full absolute pt-8 pb-10">
        <DataTable
          value={filteredData}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={10}
          rowsPerPageOptions={getFilas(filteredData)}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
        >
          <Column field="sCliCodigo" sortable header="CÓDIGO" />
          <Column field="sCliSAP" sortable header="CÓDIGO ERP" />
          <Column field="sCliRucDni" sortable header="N° de identificación fiscal" />
          <Column
            field="sCliNombre"
            sortable
            header="CLIENTE/PROSPECTO"
          />
          <Column
            field="nCliProcedencia"
            sortable
            header="PROCEDENCIA"
            body={(rowData) => (
              <span>
                {Object.keys(CustomerOrigin)[rowData.nCliProcedencia - 1]}
              </span>
            )}
          />
          <Column
            field="sCliIdCliengo"
            sortable
            header="ID CLIENGO"
            className="text-center"
            body={(rowData) => {
              const isCliengo = Number.parseInt(rowData.nCliProcedencia) === 1;
              return isCliengo ? rowData.sCliIdCliengo : "-";
            }}
          />
          <Column body={operaciones} />
        </DataTable>
        <DeleteModal
          open={openDelete}
          setOpen={setOpenDelete}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};
