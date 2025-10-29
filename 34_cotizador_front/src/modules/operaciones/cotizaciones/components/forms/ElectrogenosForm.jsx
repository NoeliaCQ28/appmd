import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { Earth, Loader2 } from "lucide-react";
import { Paginator } from "primereact/paginator";
import React from "react";
import { InputSearch } from "../../../../../components/custom/inputs/InputSearch";
import { PowerSearch } from "../../../../../components/grupos-electrogenos/PowerSearch";
import { FormSkeletonInput } from "../../../../../components/skeletons/FormSkeletonInput";
import { TableCounter } from "../../../../../components/TableCounter";
import { cn, getFilas } from "../../../../../utils/utils";
import useModelsSearch from "../../../../catalagos/grupos_electrogenos/hooks/useModelsSearch";
import { useElectrogenosFormData } from "../../hooks/useElectrogenosFormData";
import { useElectrogenosStore } from "../../hooks/useElectrogenosStore";
import { useGeneratorSet } from "../../hooks/useGeneratorSet";
import { useParametros } from "../../hooks/useParametros";
import { useGeneratorSet as useGeneratorSet_v2 } from "../../hooks/v2/useGeneratorSet";
import { useQuotationStore } from "../../store/useQuotationStore";
import { PeruFlag } from "../PeruFlag";
import { GeneratorSetCombination } from "../v2/GeneratorSetCombination";
import { Button } from "./../../../../../components/custom/buttons/Button";

const initialValues = {
  modelo: "Todos",
  motorMarca: "Todos",
  voltaje: 220,
  frecuencia: 60,
  fases: 3,
  factorPotencia: 0.8,
  altura: 100,
  temperatura: 25,
  opcionesCabina: "ABIERTO",
  powerThreshold: 20,
  primePower: "Todos",
  standbyPower: "Todos",
};

export const ElectrogenosForm = ({ isAppendMode, marketId }) => {
  const {
    modelsName,
    motorBrands,
    isLoading: {
      models: IsLoadingModelsName,
      motorBrands: IsLoadingMotorBrands,
    },
  } = useModelsSearch();

  const { formData, onHandleChange } = useElectrogenosFormData(initialValues);
  const { cabinOptions } = useParametros();
  const { generatorSetParams } = useGeneratorSet();
  const { combinations, getCombinations, isPendingCombinations } =
    useGeneratorSet_v2();

  const { setParams } = useElectrogenosStore();
  const { quote } = useQuotationStore();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [checkedKVA, setCheckedKVA] = React.useState(false);
  const [first, setFirst] = React.useState(0);
  const [rows, setRows] = React.useState(9);

  // Filtrado por búsqueda
  const filterModels = React.useMemo(() => {
    if (searchTerm === "") return combinations?.generatorSets;
    return combinations?.generatorSets.filter(
      (ge) =>
        ge.sModNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ge.sMotMarca.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [combinations, searchTerm]);

  // Reset first to 0 whenever filterModels changes to avoid pagination issues
  React.useEffect(() => {
    setFirst(0);
  }, [filterModels]);

  const paginatedModels = filterModels?.slice(first, first + rows);

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 bg-[#f3f4f8]" />
      <div className="flex flex-col space-y-6">
        {/* Sección de parámetros */}
        <div className="space-y-7 rounded-xl p-6 bg-white">
          <section className="flex items-center justify-between whitespace-nowrap">
            <h1 className="text-2xl font-bold">Parámetros</h1>{" "}
            <span className="flex items-center text-xs font-semibold  text-amber-900 px-3 py-1 rounded-md border border-amber-200 border-dashed">
              {(isAppendMode ? marketId : quote?.marketId || 1) === 1 ? (
                <p className="flex items-center gap-1">
                  MERCADO NACIONAL <PeruFlag />
                </p>
              ) : (
                <p className="flex items-center gap-1">
                  MERCADO EXPORTACIÓN <Earth height={16} width={16} />
                </p>
              )}
            </span>
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {IsLoadingModelsName ? (
              <FormSkeletonInput label="MODELO" />
            ) : (
              modelsName &&
              modelsName.length > 0 && (
                <FormSelectText
                  label={"MODELO"}
                  placeholder="Seleccione un Modelo"
                  parentClassName="w-full"
                  options={[
                    "Todos",
                    ...modelsName.map((model) => model.sModNombre),
                  ]}
                  value={formData.modelo}
                  onChange={(e) => {
                    onHandleChange("modelo", e.target.value);
                  }}
                  editable
                  filter={true}
                />
              )
            )}

            {IsLoadingMotorBrands ? (
              <FormSkeletonInput label={"MARCA DEL MOTOR"} />
            ) : (
              motorBrands &&
              motorBrands.length > 0 && (
                <FormSelectText
                  label={"MARCA DEL MOTOR"}
                  placeholder={"Seleccione una Marca"}
                  parentClassName="w-full"
                  options={[
                    { label: "Todos", value: "Todos" },
                    ...motorBrands
                      .map((motorBrand) => {
                        return {
                          label: `${motorBrand.sMotMarca}`,
                          value: motorBrand.sMotMarca,
                        };
                      })
                      .sort((a, b) => a.label.localeCompare(b.label)),
                  ]}
                  value={formData.motorMarca}
                  onChange={(e) => {
                    onHandleChange("motorMarca", e.target.value);
                  }}
                  editable
                  filter={true}
                />
              )
            )}

            <FormSelectText
              label={"Voltaje"}
              options={generatorSetParams?.voltajes?.map((v) => ({
                label: `${v} V`,
                value: v,
              }))}
              placeholder={"Seleccione voltaje"}
              value={formData.voltaje}
              onChange={(e) => onHandleChange("voltaje", e.value)}
              filter={true}
            />
            <FormSelectText
              label={"Frecuencia"}
              options={generatorSetParams?.frecuencias?.map((f) => ({
                label: `${f} Hz`,
                value: f,
              }))}
              value={formData.frecuencia}
              onChange={(e) => onHandleChange("frecuencia", e.value)}
              placeholder={"Seleccione frecuencia"}
            />
            <FormSelectText
              label={"Fases"}
              options={generatorSetParams?.fases.map((f) => {
                return {
                  label: `${f} Fases ${
                    f === 1 ? "(Monofásico)" : "(Trifásico)"
                  }`,
                  value: f,
                };
              })}
              value={formData.fases}
              onChange={(e) => {
                const phases = Number(e.value);

                onHandleChange("fases", phases);
                onHandleChange("factorPotencia", phases === 1 ? 1 : 0.8);
              }}
              placeholder={"Seleccione fases"}
            />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelectText
              label={"Factor de potencia"}
              options={generatorSetParams?.factorPotencias}
              labelName={"nIntFP"}
              value={formData.factorPotencia}
              onChange={(e) => onHandleChange("factorPotencia", e.value)}
              placeholder={"Seleccione factor de potencia"}
            />
            <FormSelectText
              parentClassName="md:col-span-1"
              label={"Altura"}
              options={generatorSetParams?.alturas?.map((a) => ({
                label: `${a} msnm`,
                value: a,
              }))}
              placeholder={"Seleccione altura"}
              value={formData.altura}
              onChange={(e) => onHandleChange("altura", e.value)}
              filter={true}
            />

            <PowerSearch
              className={"md:col-span-2"}
              powerFactor={Number.parseFloat(formData.factorPotencia)}
              averageDerate={combinations?.derates?.averageDerate}
              derateRange={combinations?.derates?.derateRange}
              primePower={formData.primePower}
              standbyPower={formData.standbyPower}
              onChangePrimePower={(value) =>
                onHandleChange("primePower", value)
              }
              onChangeStandbyPower={(value) =>
                onHandleChange("standbyPower", value)
              }
              checkedKVA={checkedKVA}
              setCheckedKVA={setCheckedKVA}
            />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelectText
              parentClassName="md:col-span-1"
              label={"Temperatura"}
              options={generatorSetParams?.temperaturas?.map((t) => ({
                label: `${t} °C`,
                value: t,
              }))}
              value={formData.temperatura}
              onChange={(e) => onHandleChange("temperatura", e.value)}
              placeholder={"Seleccione temperatura"}
            />

            <FormSelectText
              parentClassName="md:col-span-2"
              label={"Opciones de Cabina"}
              options={cabinOptions.map((item) => item.description)}
              labelName={"nIntOpcionesCabina"}
              placeholder={"Seleccione una opción"}
              value={formData.opcionesCabina}
              onChange={(e) => onHandleChange("opcionesCabina", e.value)}
            />
          </div>

          <div className="w-full flex justify-end">
            <Button
              variant={"secondary"}
              className={cn(
                "md:text-nowrap md:w-[240px] flex items-center justify-center",
                isPendingCombinations &&
                  "cursor-not-allowed opacity-50 animate-pulse"
              )}
              onClick={() => {
                // El valor de nParamInsonoro debe reflejar la lógica de la base de datos
                const nParamInsonoro = formData.isResidencial ? 0 : 1; // Insonoro = 0, Abierto = 1

                getCombinations({
                  ...formData,
                  marketId: isAppendMode ? marketId : quote?.marketId || 1,
                  primePower: !isNaN(formData.primePower)
                    ? checkedKVA
                      ? Number.parseFloat(formData.primePower) *
                        Number.parseFloat(formData.factorPotencia)
                      : Number.parseFloat(formData.primePower)
                    : formData.primePower,
                  standbyPower: !isNaN(formData.standbyPower)
                    ? checkedKVA
                      ? Number.parseFloat(formData.standbyPower) *
                        Number.parseFloat(formData.factorPotencia)
                      : Number.parseFloat(formData.standbyPower)
                    : formData.standbyPower,
                  insonoro:
                    cabinOptions.find(
                      (item) => item.description === formData.opcionesCabina
                    )?.id === 2,
                  nParamInsonoro, // Usamos el valor correcto según isResidencial
                });

                const {
                  modelo,
                  motorMarca,
                  voltaje,
                  frecuencia,
                  fases,
                  factorPotencia,
                  altura,
                  temperatura,
                  opcionesCabina,
                } = formData;
                const cabin = cabinOptions.find(
                  (item) => item.description === opcionesCabina
                );
                setParams({
                  modelo,
                  motorMarca,
                  voltaje,
                  frecuencia,
                  fases,
                  factorPotencia,
                  altura,
                  temperatura,
                  cabin,
                  insonoro: cabin.id === 2 ? 1 : 0,
                });
              }}
              disabled={isPendingCombinations}
            >
              {isPendingCombinations ? (
                <span>Buscando...</span>
              ) : (
                <span>Consultar componentes</span>
              )}
              {isPendingCombinations && (
                <Loader2
                  data-testid="loader-icon"
                  className="ml-2 animate-spin"
                  width={16}
                  height={16}
                />
              )}
            </Button>
          </div>
        </div>

        {/* Sección de modelos */}
        <section className="p-4 bg-white rounded-xl space-y-4">
          <section className="w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold">Modelos Disponibles</h1>
            {!isPendingCombinations &&
              combinations?.generatorSets?.length > 0 && (
                <TableCounter title="Modelos" data={filterModels} />
              )}
          </section>

          {isPendingCombinations ? (
            <div className="bg-[#FFFFFF] rounded-md p-5">
              <div className="flex flex-wrap -m-3">
                {[...Array(9)].map((_, index) => (
                  <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-3">
                    <div className="bg-gray-100 rounded-lg p-4 animate-pulse h-full">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-10 bg-gray-200 rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {combinations?.generatorSets?.length > 0 ? (
                <InputSearch
                  type={"text"}
                  placeholder={"Buscar modelo..."}
                  onSearch={setSearchTerm}
                />
              ) : (
                <section className="w-full col-span-2">
                  Selecciona los parámetros para consultar los modelos
                  disponibles
                </section>
              )}
              {paginatedModels && paginatedModels.length > 0 && (
                <div className="bg-[#FFFFFF] rounded-md">
                  <section className="flex flex-wrap -m-3 rounded-md">
                    {paginatedModels.map((model) => (
                      <div
                        key={model.sIntKey}
                        className={`w-full md:w-1/2 ${
                          !isAppendMode && "lg:w-1/3"
                        } p-3`}
                      >
                        <div className="h-full">
                          <GeneratorSetCombination
                            generatorSet={model}
                            options={{
                              isAdded: false,
                              isAppendMode: false,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </section>
                  <div>
                    <Paginator
                      first={first}
                      rows={rows}
                      totalRecords={combinations?.generatorSets?.length}
                      rowsPerPageOptions={getFilas(filterModels)}
                      onPageChange={onPageChange}
                    />
                  </div>
                </div>
              )}

              {combinations?.generatorSets?.length > 0 &&
                filterModels.length === 0 && (
                  <section className="w-full col-span-2">
                    <div className="text-gray-500 text-center py-4">
                      No se encontraron modelos que coincidan con la búsqueda
                    </div>
                  </section>
                )}
            </>
          )}
        </section>
      </div>
    </>
  );
};
