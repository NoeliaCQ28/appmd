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
import { useCells } from "../../../operaciones/cotizaciones/hooks/useCells";
import { CreateCeldaModal } from "../components/modals/CreateCeldaModal";

const CeldasView = () => {
  const { allCells, deleteCells } = useCells();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openCreateOrEditCeldaModal, setOpenCreateOrEditCeldaModal] =
    React.useState(false);
  const [openDeleteCeldaModal, setOpenDeleteCeldaModal] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const cellsFilter = React.useMemo(() => {
    return allCells?.filter((cell) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        cell.CeldaCodigoSAP?.toString().toLowerCase().includes(query) ||
        cell.CeldaDescripcion?.toString().toLowerCase().includes(query) ||
        cell.CeldaModelo?.toString().toLowerCase().includes(query) ||
        cell.CeldaTipo?.toString().toLowerCase().includes(query) ||
        cell.CeldaMarca?.toString().toLowerCase().includes(query)
      );
    });
  }, [allCells, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteCeldaModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteCells(selectedItem?.CeldaId);
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
              setOpenCreateOrEditCeldaModal(true);
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
              setOpenCreateOrEditCeldaModal(true);
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
            {cellsFilter && cellsFilter.length > 0 && (
              <TableCounter title="Celdas" data={cellsFilter} />
            )}
          </section>
          <section>
            <DataTable
              value={cellsFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              virtualScrollerOptions={{ itemSize: 10 }}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="CeldaCodigoSAP"
                header="Codigo ERP"
                sortable
              ></Column>
              <Column field="CeldaMarca" header="Marca" sortable></Column>
              <Column field="CeldaModelo" header="Marca" sortable></Column>
              <Column
                field="CeldaDescripcion"
                header="DESCRIPCION"
                sortable
              ></Column>
              <Column field="CeldaTipo" header="TIPO" sortable></Column>
              <Column field="CeldaUnidad" header="Unidad" sortable></Column>

              <Column
                field="CeldaPrecio"
                header="PRECIO US $"
                sortable
              ></Column>
              <Column body={operaciones} />
            </DataTable>
          </section>
        </section>
      </section>

      <CreateCeldaModal
        isOpen={openCreateOrEditCeldaModal}
        setIsOpen={setOpenCreateOrEditCeldaModal}
        isEditMode={isEditMode}
        selectedItem={selectedItem}
      />

      <DeleteModal
        open={openDeleteCeldaModal}
        setOpen={setOpenDeleteCeldaModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CeldasView;
