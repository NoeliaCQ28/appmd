import { CeilOperaciones } from "@components/CeilOperaciones";
import { DeleteModal } from "@components/modals/DeleteModal";
import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import useComercialCondition from "../hooks/useComercialCondition";

export const Table = ({ filteredData }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const { deleteMutate } = useComercialCondition();
  const navigate = useNavigate();

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDelete(true);
  };

  const openModalEdit = (item) => {
    navigate("/condiciones-comerciales/editar/", { state: { item } });
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteMutate({ id: selectedItem.CondicionesComerciales_Id });
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
              openModalEdit(rowData);
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
          <Column field="CondicionesComerciales_Id" sortable header="NRO" />
          <Column field="sCotTipoNombre" sortable header="PRODUCTO" />
          <Column
            field="sMercadoNombre"
            sortable
            header="MERCADO"
            body={(rawData) => (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50/50 text-orange-800 border border-custom-orange/20">
                {rawData.sMercadoNombre || "N/A"}
              </span>
            )}
          />
          <Column field="sConTitulo" sortable header="TITULO" />
          <Column
            field="sConDescripcion"
            sortable
            header="DESCRIPCION"
            body={(rawData) => {
              const maxLength = 100;
              const text = rawData.sConDescripcion || "SIN DESCRIPCION";
              const displayText =
                text.length > maxLength
                  ? `${text.substring(0, maxLength)}...`
                  : text;
              return <span title={text}>{displayText}</span>;
            }}
          />

          <Column body={operaciones} />
        </DataTable>
      </div>
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
