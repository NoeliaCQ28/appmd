import { BrushCleaning } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { ButtonIcon } from "../../../../components/custom/buttons/ButtonIcon";
import { InputSearch } from "../../../../components/custom/inputs/InputSearch";
import { DeleteModal } from "../../../../components/modals/DeleteModal";
import { TableCounter } from "../../../../components/TableCounter";
import { SearchGeneratorSetsForm } from "../components/forms/SearchGeneratorSetsForm";
import { AddNewGeneratorSetModelModal } from "../components/modals/AddNewGeneratorSetModelModal";
import { AlternatorInfoModal } from "../components/modals/AlternatorInfoModal";
import { CombinationModal } from "../components/modals/CombinationModal";
import { ModelInfoModal } from "../components/modals/ModelInfoModal";
import { ModelPricesModal } from "../components/modals/ModelPricesModal";
import { MotorInfoModal } from "../components/modals/MotorInfoModal";
import UpdateImages from "../components/modals/UpdateImages";
import SelectedModelsList from "../components/SelectedModelsList";
import useModelsSearch from "../hooks/useModelsSearch";
import { useModelTechnicalReport } from "../hooks/useModelTechnicalReport";
import { useGeneratorSetStore } from "../stores/useGeneratorSetStore";
import { QuoteTableSkeleton } from "../../../../components/skeletons/QuoteTableSkeleton";
import { BulkDataUploadModal } from "../components/modals/BulkDataUploadModal";

const GruposElectrogenosView = () => {
  const {
    models = [],
    search,
    deleteModeloGeAndIntegradora,
    isLoading: { searching },
  } = useModelsSearch();

  const [filterQuery, setFilterQuery] = React.useState("");

  const { searchFilters, setSearchFilters } = useGeneratorSetStore();

  const modelsFilter = React.useMemo(() => {
    return models.filter((model) => {
      if (!filterQuery.trim()) return true;

      const query = filterQuery.toLowerCase();
      return (
        model.Modelo?.toLowerCase().includes(query) ||
        model.Motor?.toLowerCase().includes(query) ||
        model.Alternador?.toLowerCase().includes(query) ||
        model.Voltaje?.toString().includes(query) ||
        model.Frecuencia?.toString().includes(query) ||
        model.Fases?.toString().includes(query) ||
        model.FactorPotencia?.toLowerCase().includes(query)
      );
    });
  }, [models, filterQuery]);

  const onSearch = async (params) => {
    await new Promise((resolve) => {
      setSearchFilters(params);
      resolve();
    });
    search();
  };

  const [selectedGeneratorSets, setSelectedGeneratorSets] = React.useState([]);

  const [OpenDeleteModelModal, setOpenDeleteModelModal] = React.useState(false);

  const [openInfoMotorModal, setOpenInfoMotorModal] = React.useState(false);
  const [openInfoAlternatorModal, setOpenInfoAlternatorModal] =
    React.useState(false);
  const [openInfoModelModal, setOpenInfoModelModal] = React.useState(false);
  const [openInfoModelPricesModal, setOpenInfoModelPricesModal] =
    React.useState(false);
  const [
    openBulkDataUploadModal,
    setOpenBulkDataUploadModal,
  ] = React.useState(false);
  const [
    openAddNewGeneratorSetModelModal,
    setOpenAddNewGeneratorSetModelModal,
  ] = React.useState(false);
  const [openUpdateImagesModal, setOpenUpdateImagesModal] =
    React.useState(false);
  const [openCombinationModal, setOpenCombinationModal] = React.useState(false);
  const [combinationModalMode, setCombinationModalMode] =
    React.useState("create");
  const { openTechnicalReports } = useModelTechnicalReport({
    modelsSelected: selectedGeneratorSets,
  });

  const confirmDelete = async () => {
    if (selectedGeneratorSets.length > 0) {
      await Promise.all(
        selectedGeneratorSets.map((modelo) =>
          deleteModeloGeAndIntegradora(modelo?.ModeloGEId)
        )
      );

      setSelectedGeneratorSets([]);

      if (searchFilters) {
        search();
      }
    }
  };

  const SELECTED_GENERATORS_SET_LIMIT = 3;

  return (
    <div className="bg-[#f3f4f8] min-h-screen p-6">
      <section className="bg-white rounded-lg p-6">
        <SearchGeneratorSetsForm onSearch={onSearch} />
      </section>
      <section className="bg-white rounded-lg mt-4 p-6 grid grid-cols-1 md:grid-cols-7 gap-4">
        <section className="col-span-6 flex flex-col gap-3">
          <section className="flex items-center justify-between">
            <section className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full min-w-0">
              <InputSearch
                type="text"
                placeholder="Buscar en la tabla"
                onSearch={(term) => {
                  setFilterQuery(term);
                }}
                className="p-2 outline-none w-full sm:max-w-xs pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500"
              />
              {selectedGeneratorSets.length > 0 && (
                <SelectedModelsList
                  models={selectedGeneratorSets}
                  limit={SELECTED_GENERATORS_SET_LIMIT}
                  onRemove={(m) =>
                    setSelectedGeneratorSets((prev) =>
                      prev.filter(
                        (x) =>
                          (x.ModeloGEId || x.Modelo) !==
                          (m.ModeloGEId || m.Modelo)
                      )
                    )
                  }
                  onClear={() => setSelectedGeneratorSets([])}
                />
              )}
            </section>
            <section className="flex items-center gap-3">
              {selectedGeneratorSets.length > 0 && (
                <ButtonIcon
                  icon={<BrushCleaning className="fill-white" />}
                  size={20}
                  color="#0055be"
                  variant="secondary"
                  className="border-[1px] border-gray-300"
                  onClick={() => setSelectedGeneratorSets([])}
                >
                  Limpiar
                </ButtonIcon>
              )}
            </section>
          </section>
          {/* Skeleton */}
          {searching ? (
            <QuoteTableSkeleton />
          ) : (
            <section>
              <DataTable
                value={modelsFilter}
                selectionMode={null}
                selection={selectedGeneratorSets}
                onSelectionChange={(e) => {
                  setSelectedGeneratorSets(e.value);
                }}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                virtualScrollerOptions={{ itemSize: 10 }}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem" }}
                ></Column>
                <Column field="Modelo" header="MODELO" sortable></Column>
                <Column
                  field="Motor"
                  header="MOTOR"
                  sortable
                  body={(rowData) => <span>{rowData?.Motor || "--"}</span>}
                ></Column>
                <Column
                  field="Alternador"
                  header="ALTERNADOR"
                  sortable
                  body={(rowData) => <span>{rowData?.Alternador || "--"}</span>}
                ></Column>
                <Column
                  field="Voltaje"
                  header="VOLTAJE"
                  sortable
                  body={(rowData) => <span>{rowData?.Voltaje || "--"}</span>}
                ></Column>
                <Column
                  field="Frecuencia"
                  header="FRECUENCIA"
                  sortable
                  body={(rowData) => <span>{rowData?.Frecuencia || "--"}</span>}
                ></Column>
                <Column
                  field="Fases"
                  header="FASES"
                  sortable
                  body={(rowData) => <span>{rowData?.Fases || "--"}</span>}
                ></Column>
                <Column
                  field="ITMA"
                  header="MODULO ITM (A)"
                  sortable
                  body={(rowData) => (
                    <span>
                      {rowData?.ITMA} {rowData?.ITMA ? "A" : "--"}
                    </span>
                  )}
                ></Column>
                <Column
                  field="FactorPotencia"
                  header="FACTOR POTENCIA"
                  sortable
                  body={(rowData) => (
                    <span>{rowData?.FactorPotencia || "--"}</span>
                  )}
                ></Column>
                <Column
                  field="Mercado"
                  header="Mercado"
                  sortable
                  body={(rowData) => <span>{rowData?.Mercado || "--"}</span>}
                ></Column>
              </DataTable>
            </section>
          )}
        </section>
        <section className="col-span-1 flex flex-col gap-3 justify-center md:justify-between md:items-end pl-2 max-h-[420px] items-center sm:text-xs">
          {modelsFilter && modelsFilter.length > 0 && (
            <TableCounter
              title="Modelos y Combinaciones"
              data={modelsFilter}
              className={"whitespace-nowrap"}
            />
          )}
          <Button
            type="button"
            style={{ width: "100%" }}
            onClick={() => setOpenBulkDataUploadModal(true)}
          >
            CARGAR DATOS
          </Button>{" "}
          <Button
            type="button"
            style={{ width: "100%" }}
            onClick={() => setOpenAddNewGeneratorSetModelModal(true)}
          >
            NUEVO
          </Button>{" "}
          <Button
            type="button"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            onClick={() => {
              setCombinationModalMode("create");
              setOpenCombinationModal(true);
            }}
          >
            N. COMBINACIÓN
          </Button>
          <Button
            type="button"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            variant="secondary"
            onClick={() => {
              setCombinationModalMode("edit");
              setOpenCombinationModal(true);
            }}
            disabled={selectedGeneratorSets.length === 0}
          >
            EDITAR COMBINACIÓN
          </Button>
          <Button
            type="button"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            onClick={() => setOpenUpdateImagesModal(true)}
            disabled={filterQuery.trim() === "" && !searchFilters} // Simplificado: deshabilita solo si no hay filtros
          >
            CARGAR IMÁGENES
          </Button>
          <Button
            type="button"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            variant="secondary"
            onClick={() => setOpenInfoMotorModal(true)}
            disabled={selectedGeneratorSets.length === 0}
          >
            INFO. MOTOR
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            onClick={() => setOpenInfoAlternatorModal(true)}
            disabled={selectedGeneratorSets.length === 0}
          >
            INFO. ALTERNADOR
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            onClick={() => setOpenInfoModelModal(true)}
            disabled={selectedGeneratorSets.length === 0}
          >
            INFO. MODELO
          </Button>
          <Button
            type="button"
            variant="tertiary"
            style={{ width: "100%" }}
            onClick={() => setOpenInfoModelPricesModal(true)}
            disabled={selectedGeneratorSets.length === 0}
          >
            PRECIOS
          </Button>
          <Button
            type="button"
            variant="tertiary"
            className="text-nowrap line-clamp-1"
            style={{ width: "100%" }}
            disabled={selectedGeneratorSets.length === 0}
            onClick={() => {
              if (selectedGeneratorSets.length > 0) {
                openTechnicalReports();
              }
            }}
          >
            FICHA TÉCNICA
          </Button>
          <Button
            type="button"
            variant="destructive"
            style={{ width: "100%" }}
            disabled={selectedGeneratorSets.length === 0}
            onClick={() => setOpenDeleteModelModal(true)}
          >
            ELIMINAR
          </Button>
        </section>
      </section>
      <BulkDataUploadModal
        isOpen={openBulkDataUploadModal}
        setIsOpen={setOpenBulkDataUploadModal}
      />
      <MotorInfoModal
        isOpen={openInfoMotorModal}
        setIsOpen={setOpenInfoMotorModal}
        selectedModels={selectedGeneratorSets}
      />
      <AlternatorInfoModal
        isOpen={openInfoAlternatorModal}
        setIsOpen={setOpenInfoAlternatorModal}
        selectedModels={selectedGeneratorSets}
      />
      <ModelInfoModal
        isOpen={openInfoModelModal}
        setIsOpen={setOpenInfoModelModal}
        selectedModels={selectedGeneratorSets}
      />
      <ModelPricesModal
        isOpen={openInfoModelPricesModal}
        setIsOpen={setOpenInfoModelPricesModal}
        selectedModels={selectedGeneratorSets}
      />
      <AddNewGeneratorSetModelModal
        isOpen={openAddNewGeneratorSetModelModal}
        setIsOpen={setOpenAddNewGeneratorSetModelModal}
      />{" "}
      <CombinationModal
        isOpen={openCombinationModal}
        setIsOpen={setOpenCombinationModal}
        selectedModels={selectedGeneratorSets}
        setSelectedGeneratorSets={setSelectedGeneratorSets}
        mode={combinationModalMode}
      />
      {openUpdateImagesModal && (
        <UpdateImages
          isOpen={openUpdateImagesModal}
          setIsOpen={setOpenUpdateImagesModal}
          models={modelsFilter}
        />
      )}
      <DeleteModal
        open={OpenDeleteModelModal}
        setOpen={setOpenDeleteModelModal}
        onConfirm={confirmDelete}
        message={`Se eliminará el/los ${
          selectedGeneratorSets.length
        } modelo(s) (${[
          ...new Set(selectedGeneratorSets.map((ge) => ge.Modelo)),
        ].join(", ")}) seleccionado(s) y todas sus combinaciones ⚠️.`}
      />
    </div>
  );
};

export default GruposElectrogenosView;
