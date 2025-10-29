import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CeilOperaciones } from "../../../../components/CeilOperaciones";
import { Button } from "../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../components/modals/DeleteModal";

import { CreateUserModal } from "../components/modals/CreateUserModal";
import useUsuarios from "../hooks/useUsuarios";
import { TableCounter } from "../../../../components/TableCounter";

const UsersView = () => {
  const { users, isLoadingUsers } = useUsuarios();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openCreateOrEditUserModal, setOpenCreateOrEditUserModal] =
    React.useState(false);
  const [openDeleteTransformadorModal, setOpenDeleteTransformadorModal] =
    React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const transformersFilter = React.useMemo(() => {
    return users?.filter((user) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        user.sUsuNombre?.toString().toLowerCase().includes(query) ||
        user.sUsuLogin?.toString().toLowerCase().includes(query)
      );
    });
  }, [users, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteTransformadorModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      //deleteTransformers(selectedItem?.Usuario_Id);
      setSelectedItem(null);
    }
  };
  const operaciones = (rowData) => {
    return (
      <div className="flex space-x-2">
        <CeilOperaciones>
          <MdModeEdit
            color="green"
            size={20}
            onClick={() => {
              setIsEditMode(true);
              setSelectedItem(rowData);
              setOpenCreateOrEditUserModal(true);
            }}
          />
        </CeilOperaciones>
        {/* <CeilOperaciones>
          <RiDeleteBinLine
            color="red"
            size={20}
            onClick={() => openModalDelete(rowData)}
          />
        </CeilOperaciones> */}
      </div>
    );
  };

  return (
    <div className="bg-white h-full p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-4">
        <div className="hidden sm:block"></div>

        <InputSearch
          type="text"
          placeholder="Buscar en la tabla"
          onSearch={(term) => {
            setFilterQuery(term);
          }}
          className="p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-96"
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            onClick={() => {
              setOpenCreateOrEditUserModal(true);
              setIsEditMode(false);
              setSelectedItem(null);
            }}
          >
            Agregar
          </Button>
        </div>
      </div>

      <section className="bg-white rounded-lg mt-4 p-6 grid grid-cols-1  gap-4">
        <section className="flex flex-col gap-3">
          <section className="flex items-center justify-end">
            {transformersFilter && transformersFilter.length > 0 && (
              <TableCounter title="Usuarios" data={transformersFilter} />
            )}
          </section>
          <section>
            <DataTable
              value={transformersFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              virtualScrollerOptions={{ itemSize: 10 }}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="iUsuImagen"
                header=""
                style={{ width: "4rem" }}
                body={(rowData) =>
                  rowData.iUsuImagen ? (
                    <img src={rowData.iUsuImagen} alt="User" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  )
                }
              ></Column>
              <Column field="sUsuNombre" header="NOMBRE" sortable></Column>
              <Column
                field="sUsuLogin"
                header="CORREO ELECTRONICO"
                sortable
              ></Column>
              <Column
                field="sUsuRol"
                header="ROL"
                sortable
                body={(rowData) => (
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      rowData.sUsuRol?.toLowerCase() === "administrador"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {rowData.sUsuRol}
                  </div>
                )}
              />
              <Column
                field="sUsuEstado"
                header="ESTADO"
                sortable
                body={(rowData) => (
                  <div
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      rowData.sUsuEstado?.toLowerCase() === "habilitado"
                        ? "bg-[#e9ffe0] text-[#64b95f]"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {rowData.sUsuEstado}
                  </div>
                )}
              ></Column>

              <Column body={operaciones} />
            </DataTable>
          </section>
        </section>
      </section>

      <CreateUserModal
        isOpen={openCreateOrEditUserModal}
        setIsOpen={setOpenCreateOrEditUserModal}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
      <DeleteModal
        open={openDeleteTransformadorModal}
        setOpen={setOpenDeleteTransformadorModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default UsersView;
