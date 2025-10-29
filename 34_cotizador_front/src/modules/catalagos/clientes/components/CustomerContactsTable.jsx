import { CeilOperaciones } from "@components/CeilOperaciones";
import { DeleteModal } from "@components/modals/DeleteModal";
import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import useCustomersContacts from "../hooks/useCustomerContacts";
import { ContactModal } from "./forms/modals/ContactModal";

export const CustomerContactsTable = ({ filteredData, customerId }) => {
  const { deleteMutate } = useCustomersContacts();

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState(null);

  const openModalEdit = (item) => {
    setSelectedContact(item);
    setOpenEdit(true);
  };

  const openModalDelete = (item) => {
    setSelectedContact(item);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (selectedContact) {
      deleteMutate({
        customer_id: customerId,
        contact_id: selectedContact.Contacto_Id,
      });
      setSelectedContact(null);
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
          emptyMessage="Aún no hay contactos registrados"
          rowsPerPageOptions={getFilas(filteredData)}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} - {last} de {totalRecords}"
        >
          <Column field="sCliConNombre" header="NOMBRE" />
          <Column field="sCliConNombrePila" header="N. PILA" />
          <Column field="sCliConTelefono" header="TELEFONO" />
          <Column
            field="sCliConCargo"
            header="CARGO"
            body={(rowData) => {
              return (
                <span className="flex justify-center">
                  {rowData.ContactoDenominacionId ? rowData.ContactoDenominacionDescripcion : rowData?.sCliConCargo || "No definido"}
                </span>
              );
            }}
          />
          <Column
            field="ConDepartamentoNombre"
            header="DEPARTAMENTO"
            body={(rowData) => {
              return (
                <span className="flex justify-center">
                  {rowData.ConDepartamentoNombre ? rowData.ConDepartamentoNombre :  "No definido"}
                </span>
              );
            }}
          />
          <Column field="sCliConCorreo" header="CORREO" />

          <Column body={operaciones} header="OPERACIONES" />
        </DataTable>
      </div>
      <DeleteModal
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={confirmDelete}
      />
      <ContactModal
        isOpen={openEdit}
        setIsOpen={setOpenEdit}
        customerId={customerId}
        selectedItem={selectedContact}
        isEditMode={true}
      />
    </div>
  );
};
