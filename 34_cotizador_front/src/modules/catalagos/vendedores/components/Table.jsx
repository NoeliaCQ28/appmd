import { CeilOperaciones } from "@components/CeilOperaciones";
import { DeleteModal } from "@components/modals/DeleteModal";
import { EstadoBadge } from "@components/Status";
import { getFilas, getObjectHash } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useVendedores } from "../hooks/useVendedores";
import { VendedoresModal } from "./forms/modals/VendedoresModal";

export const Table = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { eliminar } = useVendedores();

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
  };

  const openModalEdit = (item) => {
    setSelectedItem(item);
    setIsEditMode(true);
    setOpenEdit(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      eliminar({ id: selectedItem.Ejecutivo_Id });
      setSelectedItem(null);
    }
  };

  const operaciones = (rowData) => {
    return (
      <div className="flex space-x-2">
        <CeilOperaciones>
          {" "}
          <MdModeEdit
            onClick={() => openModalEdit(rowData)}
            color="green"
            size={20}
          />{" "}
        </CeilOperaciones>
        <CeilOperaciones>
          {" "}
          <RiDeleteBinLine
            onClick={() => openModalDelete(rowData)}
            color="red"
            size={20}
          />{" "}
        </CeilOperaciones>
      </div>
    );
  };

  return (
    <div className="pt-0 md:p-4 relative">
      <div className="w-full absolute pt-8 pb-10">
        <DataTable
          value={data}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={10}
          rowsPerPageOptions={getFilas(data)}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
        >
          <Column field="sEjeCodigo" sortable header="CÓDIGO" />
          <Column field="sEjeSAP" sortable header="CÓDIGO ERP" />
          {/* <Column field="documento" header="N° de identificación fiscal" /> */}
          <Column field="sEjeNombre" sortable header="EJECUTIVO" />
          <Column field="sEjeCorreo" sortable header="CORREO" />
          <Column
            field="nEjeEstado"
            sortable
            header="ESTADO"
            body={(rowData) => (
              <EstadoBadge estado={Number.parseInt(rowData.nEjeEstado)} />
            )}
          />
          <Column body={operaciones} />
        </DataTable>
      </div>
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={confirmDelete}
      />

      <VendedoresModal
        key={selectedItem && selectedItem ? getObjectHash(selectedItem) : "new"}
        VendedorVisible={openEdit}
        setVendedorVisible={setOpenEdit}
        selectedItem={selectedItem}
        isEditMode={isEditMode}
      />
    </div>
  );
};
