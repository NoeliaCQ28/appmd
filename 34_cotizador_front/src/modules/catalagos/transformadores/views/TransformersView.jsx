import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CeilOperaciones } from "../../../../components/CeilOperaciones";
import { Button } from "../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../components/modals/DeleteModal";
import { useTransformers } from "../../../operaciones/cotizaciones/hooks/useTransformers";
import { CreateTransformadorModal } from "../components/modals/CreateTransformadorModal";
import { TableCounter } from "../../../../components/TableCounter";

const TransformersView = () => {
  const { allTransformers, deleteTransformers } = useTransformers();

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [
    openCreateOrEditTransformadorModal,
    setOpenCreateOrEditTransformadorModal,
  ] = React.useState(false);
  const [openDeleteTransformadorModal, setOpenDeleteTransformadorModal] =
    React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const transformersFilter = React.useMemo(() => {
    return allTransformers?.filter((transformer) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        transformer.TransformadorDescripcion?.toString()
          .toLowerCase()
          .includes(query) ||
        transformer.TransformadorCodigoSAP?.toString()
          .toLowerCase()
          .includes(query)
      );
    });
  }, [allTransformers, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteTransformadorModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteTransformers(selectedItem?.TransformadorId);
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
              setOpenCreateOrEditTransformadorModal(true);
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
              setOpenCreateOrEditTransformadorModal(true);
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
              <TableCounter title="Transformadores" data={transformersFilter} />
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
                field="TransformadorCodigoSAP"
                header="Codigo ERP"
                sortable
              ></Column>
              <Column
                field="TransformadorMarca"
                header="Marca"
                sortable
              ></Column>
              <Column field="TransformadorTipo" header="Tipo" sortable></Column>
              <Column
                field="TransformadorNombre"
                header="NOMBRE"
                sortable
              ></Column>
              <Column
                field="TransformadorDescripcion"
                header="DESCRIPCION"
                sortable
                body={(rowData) => (
                  <section className="flex items-center">
                    <span className="max-w-80 overflow-x-auto line-clamp-2">
                      {rowData.TransformadorDescripcion}
                    </span>
                  </section>
                )}
              ></Column>
              <Column
                field="TransformadorUnidad"
                header="UNIDAD"
                sortable
              ></Column>

              <Column
                field="TransformadorPrecio"
                header="PRECIO US $"
                sortable
              ></Column>
              <Column body={operaciones} />
            </DataTable>
          </section>
        </section>
      </section>

      <CreateTransformadorModal
        isOpen={openCreateOrEditTransformadorModal}
        setIsOpen={setOpenCreateOrEditTransformadorModal}
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

export default TransformersView;
