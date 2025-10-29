import { EstadoBadge } from "@components/Status";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { CeilOperaciones } from "../../../../../components/CeilOperaciones";
import { Button } from "../../../../../components/custom/buttons/Button";
import { InputSearch } from "../../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../../components/modals/DeleteModal";
import { useOptionals } from "../../../../operaciones/cotizaciones/hooks/useOptionals";
import { CreateAccesorioModal } from "../components/modals/CreateAccesorioModal";
import { TableCounter } from "../../../../../components/TableCounter";

const AccesoriosGruposElectrogenosView = () => {
  const { allOptionals = [], deleteOptional } = useOptionals({});

  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openCreateOrEditAccesorioModal, setOpenCreateOrEditAccesorioModal] =
    React.useState(false);
  const [openDeleteAccesorioModal, setOpenDeleteAccesorioModal] =
    React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);

  const optionalsFilter = React.useMemo(() => {
    return allOptionals.filter((optional) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        optional.Tipo?.toString().toLowerCase().includes(query) ||
        optional.Aplicacion?.toString().toLowerCase().includes(query) ||
        optional.sOpcCodigo?.toLowerCase().includes(query) ||
        optional.sOpcNombre?.toLowerCase().includes(query) ||
        optional.sOpcDescripcion?.toString().includes(query) ||
        optional.sOpcMarca?.toString().includes(query) ||
        optional.sOpcDesde?.toString().includes(query) ||
        optional.sOpcHasta?.toLowerCase().includes(query) ||
        optional.sOpcFamilia?.toLowerCase().includes(query) ||
        optional.sOpcBanDerrConLiquidos?.toLowerCase().includes(query)
      );
    });
  }, [allOptionals, filterQuery]);

  const openModalDelete = (item) => {
    setSelectedItem(item);
    setOpenDeleteAccesorioModal(true);
  };

  const confirmDelete = () => {
    if (selectedItem) {
      deleteOptional(selectedItem?.Opcionales_Id);
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
            {optionalsFilter && optionalsFilter.length > 0 && (
              <TableCounter title="Accesorios" data={optionalsFilter} />
            )}
          </section>
          <section>
            <DataTable
              value={optionalsFilter}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25, 50]}
              virtualScrollerOptions={{ itemSize: 10 }}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="Tipo" header="TIPO" sortable></Column>
              <Column
                field="Nombre"
                header="ACCESORIO"
                sortable
                body={(rowData) => (
                  <div className="flex items-center gap-2">
                    {rowData.nOpcValorEstandar === 1 && (
                      <section className="bg-green-100 text-green-900 w-fit px-2 py-1 rounded-md text-xs font-semibold">
                        Estandar
                      </section>
                    )}

                    <p>{rowData.Nombre}</p>
                  </div>
                )}
              ></Column>
              <Column
                field="sOpcFabricacion"
                header="FABRICACION"
                sortable
              ></Column>
              <Column
                field="nOpcAplicacion"
                header="APLICACIÓN"
                sortable
                style={{ width: "350px", minWidth: "350px" }}
              ></Column>
              <Column field="sOpcMarca" header="MARCA" sortable></Column>
              <Column field="nOpcPrecio" header="PRECIO US $" sortable></Column>
              <Column field="nOpcCosto" header="COSTO US $" sortable></Column>
              <Column
                field="nOpcMargenVariable"
                header="MARGEN VARIABLE"
                sortable
                body={(rowData) => (
                  <span>{Number(rowData.nOpcMargenVariable).toFixed(2)}%</span>
                )}
              ></Column>
              <Column
                field="nOpcMargenFijo"
                header="MARGEN FIJO"
                sortable
                body={(rowData) => (
                  <span>{Number(rowData.nOpcMargenFijo).toFixed(2)}%</span>
                )}
              ></Column>
              <Column
                field="nOpcEstado"
                sortable
                header="ESTADO"
                body={(rowData) => (
                  <EstadoBadge estado={Number.parseInt(rowData.nOpcEstado)} />
                )}
              />
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

export default AccesoriosGruposElectrogenosView;
