import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CeilOperaciones } from "../../../../../components/CeilOperaciones";
import { Button } from "../../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../../components/modals/DeleteModal";
import { TableCounter } from "../../../../../components/TableCounter";
import { useCells } from "../../../../operaciones/cotizaciones/hooks/useCells";
import { CreateAccesorioModal } from "../components/modals/CreateAccesorioModal";

const AccesoriosCellsView = () => {
  const { accesorios = [], deleteAccesorioMutate } = useCells();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openCreateOrEditAccesorioModal, setOpenCreateOrEditAccesorioModal] =
    React.useState(false);
  const [openDeleteAccesorioModal, setOpenDeleteAccesorioModal] =
    React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const accesoriosFilter = React.useMemo(() => {
    return accesorios.filter((accesorio) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        accesorio.sCelAccCodSAP?.toString().toLowerCase().includes(query) ||
        accesorio.sCelAccDescripcion
          ?.toString()
          .toLowerCase()
          .includes(query) ||
        accesorio.sCelMarDescripcion?.toLowerCase().includes(query)
      );
    });
  }, [accesorios, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteAccesorioModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteAccesorioMutate(selectedItem?.CeldaAccesorio_Id);
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
              setSelectedItem(rowData);
              setOpenCreateOrEditAccesorioModal(true);
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
              setOpenCreateOrEditAccesorioModal(true);
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
            {accesoriosFilter && accesoriosFilter.length > 0 && (
              <TableCounter title="Accesorios" data={accesoriosFilter} />
            )}
          </section>
          <section>
            <DataTable
              value={accesoriosFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              virtualScrollerOptions={{ itemSize: 10 }}
              tableStyle={{ minWidth: "50rem" }}
              sortField="CeldaAccesorio_Id"
              sortOrder={-1}
            >
              <Column
                field="sCelAccCodSAP"
                header="CÓDIGO ERP"
                sortable
              ></Column>

              <Column
                field="sCelMarDescripcion"
                header="MARCA"
                sortable
              ></Column>
              <Column
                field="sCelAccDescripcion"
                header="ACCESORIO"
                sortable
              ></Column>
              <Column
                field="nCelAccPrecio"
                header="PRECIO US $"
                sortable
              ></Column>
              <Column body={operaciones} />
            </DataTable>
          </section>
        </section>
      </section>

      <CreateAccesorioModal
        isOpen={openCreateOrEditAccesorioModal}
        setIsOpen={setOpenCreateOrEditAccesorioModal}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
      <DeleteModal
        open={openDeleteAccesorioModal}
        setOpen={setOpenDeleteAccesorioModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AccesoriosCellsView;
