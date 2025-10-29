import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CeilOperaciones } from "../../../../components/CeilOperaciones";
import { Button } from "../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../components/modals/DeleteModal";
import { TableCounter } from "../../../../components/TableCounter";
import { useCables } from "../../../operaciones/cotizaciones/hooks/useCables";
import { CreateCableModal } from "../components/modals/CreateCableModal";

const CablesView = () => {
  const { allCables, deleteCable } = useCables();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openCreateOrEditCableModal, setOpenCreateOrEditCableModal] =
    React.useState(false);
  const [openDeleteCableModal, setOpenDeleteCableModal] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const cablesFilter = React.useMemo(() => {
    return allCables?.filter((cable) => {
      if (!filterQuery.trim()) return true;
      const query = filterQuery.toLowerCase();
      return (
        cable.CableDescripcion?.toString().toLowerCase().includes(query) ||
        cable.CableCodigoSAP?.toString().toLowerCase().includes(query)
      );
    });
  }, [allCables, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteCableModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteCable(selectedItem?.CableId);
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
              setOpenCreateOrEditCableModal(true);
            }}
          />
        </CeilOperaciones>
        <CeilOperaciones>
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
              setOpenCreateOrEditCableModal(true);
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
            {cablesFilter && cablesFilter.length > 0 && (
              <TableCounter title="Cables" data={cablesFilter} />
            )}
          </section>
          <section>
            <DataTable
              value={cablesFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              virtualScrollerOptions={{ itemSize: 10 }}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="CableCodigoSAP"
                header="Codigo ERP"
                sortable
              ></Column>
              <Column field="CableMarca" header="Marca" sortable></Column>
              <Column
                field="CableNombre"
                header="NOMBRE"
                sortable
              ></Column>
              <Column
                field="CableDescripcion"
                header="DESCRIPCION"
                sortable
              ></Column>
              <Column
                field="CableTipo"
                header="TIPO"
                sortable
                style={{ width: "350px", minWidth: "350px" }}
              ></Column>

              <Column
                field="CablePrecio"
                header="PRECIO US $"
                sortable
              ></Column>
              <Column body={operaciones} />
            </DataTable>
          </section>
        </section>
      </section>

      <CreateCableModal
        isOpen={openCreateOrEditCableModal}
        setIsOpen={setOpenCreateOrEditCableModal}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />
      <DeleteModal
        open={openDeleteCableModal}
        setOpen={setOpenDeleteCableModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CablesView;
