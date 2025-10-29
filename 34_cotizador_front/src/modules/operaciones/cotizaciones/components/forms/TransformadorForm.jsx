import { InputSearch } from "@components/custom/inputs/InputSearch";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { getFilas, searchInput } from "@utils/utils";
import { CirclePlus, Loader2, Truck, Wrench } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button.jsx";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText.jsx";
import { Discount } from "../../../../../components/Discount.jsx";
import { useExchange } from "../../hooks/useExchange.js";
import { useTransformers } from "../../hooks/useTransformers.js";
import { useTransformersStore } from "../../hooks/useTransformersStore.js";
import { TransformadorAccesoriosModal } from "./modals/TransformadorAccesoriosModal.jsx";

export const TransformadorForm = ({
  isEditMode = false,
  isAppendMode = false,
}) => {
  const {
    params,
    isLoadingParams,
    search,
    transformers,
    isLoadingTransformers,
  } = useTransformers();

  const { control, reset, handleSubmit } = useForm();
  const { currency, evalTypeChange } = useExchange();

  const onSubmit = (data) => {
    search(data);
  };

  const {
    addTransformer,
    removeTransformer,
    transformersAdded,
    setDiscount,
    discount,
    updateTransformer,
    updateOperativeCosts,
  } = useTransformersStore();

  const [filteredSubItems, setFilteredSubItems] = useState(transformers);
  const [selectedTransformers, setSelectedTransformers] =
    useState(transformersAdded);

  React.useEffect(() => {
    setFilteredSubItems(transformers);
  }, [transformers]);

  const handleSearch = (term) => {
    const filtered = searchInput(transformers, term);
    setFilteredSubItems(filtered);
  };

  const [openOptionalsModal, setOpenOptionalsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Estado para almacenar los detalles (cantidad y días) ingresados para cada transformador
  const [transformerDetails, setTransformerDetails] = useState({});
  const [operativeCostsDetails, setOperativeCostsDetails] = useState({});

  // Al cargar los transformadores, inicializa cada uno con cantidad 1 y días 15.
  React.useEffect(() => {
    if (!transformers) return;

    setFilteredSubItems(transformers);
    const defaults = {};
    const operativeDefaults = {};

    transformers.forEach((transformer) => {
      // Buscar si el transformador ya existe en el array
      const existingTransformer = transformersAdded.find(
        (t) => t.TransformadorId === transformer.TransformadorId
      );

      if (existingTransformer) {
        // Si existe, usar sus valores actuales
        defaults[transformer.TransformadorId] = {
          quantity: existingTransformer.TransformadorCantidad || 1,
          days: existingTransformer.TransformadorDiasEntrega || 15,
          price: existingTransformer.TransformadorPrecio
            ? Number.parseFloat(existingTransformer.TransformadorPrecio)
            : Number.parseFloat(transformer.TransformadorPrecio) || 0,
        };
        operativeDefaults[transformer.TransformadorId] =
          existingTransformer.operativeCosts || {
            shipping: { isPresent: false, amount: 0 },
            startup: { isPresent: false, amount: 0 },
          };
      } else {
        // Si no existe, usar valores predeterminados
        defaults[transformer.TransformadorId] = {
          quantity: 1,
          days: 15,
          price: Number.parseFloat(transformer.TransformadorPrecio) || 0,
        };
        operativeDefaults[transformer.TransformadorId] = {
          shipping: { isPresent: false, amount: 0 },
          startup: { isPresent: false, amount: 0 },
        };
      }
    });

    setTransformerDetails(defaults);
    setOperativeCostsDetails(operativeDefaults);
  }, [transformers, transformersAdded]);

  // Actualiza la cantidad y, si el transformador está seleccionado, lo actualiza en la lista
  const handleQuantityChange = useCallback(
    (transformerId, value) => {
      // Primero actualizamos los detalles del transformador
      setTransformerDetails((prev) => ({
        ...prev,
        [transformerId]: {
          ...prev[transformerId],
          quantity: Number(value),
        },
      }));

      // Luego actualizamos el transformador seleccionado si existe
      setSelectedTransformers((prevSelected) => {
        const transformer = prevSelected.find(
          (t) => t.TransformadorId === transformerId
        );
        if (transformer) {
          const updatedTransformer = {
            ...transformer,
            TransformadorCantidad: Number(value),
            TransformadorDiasEntrega:
              transformer.TransformadorDiasEntrega || 15,
          };
          updateTransformer(updatedTransformer);
          return prevSelected.map((t) =>
            t.TransformadorId === transformerId ? updatedTransformer : t
          );
        }
        return prevSelected;
      });
    },
    [updateTransformer]
  );

  // Actualiza los días y, si el transformador está seleccionado, lo actualiza en la lista
  const handleDaysChange = useCallback(
    (transformerId, value) => {
      // Primero actualizamos los detalles del transformador
      setTransformerDetails((prev) => ({
        ...prev,
        [transformerId]: {
          ...prev[transformerId],
          days: Number(value),
        },
      }));

      // Luego actualizamos el transformador seleccionado si existe
      setSelectedTransformers((prevSelected) => {
        const transformer = prevSelected.find(
          (t) => t.TransformadorId === transformerId
        );
        if (transformer) {
          const updatedTransformer = {
            ...transformer,
            TransformadorCantidad: transformer.TransformadorCantidad || 1,
            TransformadorDiasEntrega: Number(value),
          };
          updateTransformer(updatedTransformer);
          return prevSelected.map((t) =>
            t.TransformadorId === transformerId ? updatedTransformer : t
          );
        }
        return prevSelected;
      });
    },
    [updateTransformer]
  );

  const handlePriceChange = useCallback(
    (transformerId, value) => {
      // Primero actualizamos los detalles del transformador
      setTransformerDetails((prev) => ({
        ...prev,
        [transformerId]: {
          ...prev[transformerId],
          price: value === "" ? "" : Number(value),
        },
      }));

      // Luego actualizamos el transformador seleccionado si existe
      setSelectedTransformers((prevSelected) => {
        const transformer = prevSelected.find(
          (t) => t.TransformadorId === transformerId
        );
        if (transformer) {
          const updatedTransformer = {
            ...transformer,
            TransformadorCantidad: transformer.TransformadorCantidad || 1,
            TransformadorDiasEntrega:
              transformer.TransformadorDiasEntrega || 15,
            TransformadorPrecio: value === "" ? 0 : Number(value),
          };
          updateTransformer(updatedTransformer);
          return prevSelected.map((t) =>
            t.TransformadorId === transformerId ? updatedTransformer : t
          );
        }
        return prevSelected;
      });
    },
    [updateTransformer]
  );

  // Handler for updating operative costs of individual transformers
  const handleOperativeCostChange = useCallback(
    (transformerId, costType, field, value) => {
      // Update local state with proper defaults
      setOperativeCostsDetails((prev) => {
        const currentCostType = prev[transformerId]?.[costType] || {};
        let updatedCostType = { ...currentCostType };

        if (field === "isPresent") {
          // When activating/deactivating, ensure amount is properly set
          updatedCostType = {
            isPresent: value,
            amount: value ? currentCostType.amount || 0 : 0,
          };
        } else {
          // For amount changes, just update the field
          updatedCostType[field] = value;
        }

        return {
          ...prev,
          [transformerId]: {
            ...prev[transformerId],
            [costType]: updatedCostType,
          },
        };
      });

      // Update selected transformer if it exists
      setSelectedTransformers((prevSelected) => {
        const transformer = prevSelected.find(
          (t) => t.TransformadorId === transformerId
        );
        if (transformer) {
          const currentOperativeCosts = transformer.operativeCosts || {};
          const currentCostType = currentOperativeCosts[costType] || {};

          let updatedCostType = { ...currentCostType };

          if (field === "isPresent") {
            // When activating/deactivating, ensure amount is properly set
            updatedCostType = {
              isPresent: value,
              amount: value ? currentCostType.amount || 0 : 0,
            };
          } else {
            // For amount changes, just update the field
            updatedCostType[field] = value;
          }

          const updatedOperativeCosts = {
            ...currentOperativeCosts,
            [costType]: updatedCostType,
          };

          const updatedTransformer = {
            ...transformer,
            // Preserve existing values to prevent NaN
            TransformadorCantidad:
              transformer.TransformadorCantidad ||
              transformerDetails[transformerId]?.quantity ||
              1,
            TransformadorDiasEntrega:
              transformer.TransformadorDiasEntrega ||
              transformerDetails[transformerId]?.days ||
              15,
            TransformadorPrecio:
              transformer.TransformadorPrecio !== undefined
                ? transformer.TransformadorPrecio
                : transformerDetails[transformerId]?.price || 0,
            operativeCosts: updatedOperativeCosts,
          };
          updateTransformer(updatedTransformer);
          updateOperativeCosts(transformerId, updatedOperativeCosts);
          return prevSelected.map((t) =>
            t.TransformadorId === transformerId ? updatedTransformer : t
          );
        }
        return prevSelected;
      });
    },
    [updateTransformer, updateOperativeCosts, transformerDetails]
  );

  return (
    <div className="flex flex-col py-4">
      <div className="space-y-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {isLoadingParams ? (
            <>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-28"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </>
          ) : (
            <>
              <Controller
                name="brand"
                control={control}
                rules={{ required: true }}
                defaultValue={"Todos"}
                render={({ field }) => (
                  <FormSelectText
                    label={"Marca"}
                    placeholder={"Seleccione Marca"}
                    options={[
                      { label: "Todos", value: "Todos" },
                      ...params.brands.map((brand) => ({
                        value: brand.sTraMarDescripcion,
                        label: brand.sTraMarDescripcion,
                      })),
                    ]}
                    disabled={isLoadingParams}
                    {...field}
                  />
                )}
              />
              <Controller
                name="type"
                control={control}
                rules={{ required: true }}
                defaultValue={"Todos"}
                render={({ field }) => (
                  <FormSelectText
                    label={"Tipo de Transformador"}
                    placeholder={"Seleccione un Tipo"}
                    options={["Todos", ...params.types]}
                    disabled={isLoadingParams}
                    {...field}
                  />
                )}
              />
            </>
          )}
          <section className="col-span-2 flex justify-end items-center">
            {isLoadingParams ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            ) : (
              <Button
                variant="secondary"
                type="submit"
                className="md:w-fit"
                disabled={isLoadingParams || isLoadingTransformers}
              >
                {isLoadingTransformers ? (
                  <span>Buscando...</span>
                ) : (
                  <span>Consultar transformadores</span>
                )}

                {isLoadingTransformers && (
                  <section>
                    <Loader2
                      className="ml-2 animate-spin"
                      width={22}
                      height={22}
                    />
                  </section>
                )}
              </Button>
            )}
          </section>
        </form>

        <div className="flex flex-col gap-4 justify-center items-center">
          <InputSearch
            type={"text"}
            placeholder={"Buscar en la tabla"}
            onSearch={handleSearch}
            className={
              "p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-80"
            }
            disabled={isLoadingTransformers}
          />

          <div className="pt-0 md:p-4 w-full">
            {isLoadingTransformers ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-4 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-8 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            ) : filteredSubItems ? (
              <DataTable
                value={filteredSubItems}
                tableStyle={{ minWidth: "50rem" }}
                paginator
                rows={10}
                rowsPerPageOptions={getFilas(filteredSubItems)}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} - {last} de {totalRecords}"
                selectionMode={"multiple"}
                metaKeySelection={false}
                onRowClick={(e) => e.preventDefault()}
                selection={selectedTransformers}
                onSelectionChange={(e) => setSelectedTransformers(e.value)}
                dataKey="TransformadorId"
                onRowSelect={(e) => {
                  const transformer = e.data;

                  if (
                    transformer?.TransformadorCodigoSAP === "" ||
                    transformer?.TransformadorCodigoSAP === null
                  ) {
                    toast.warning(
                      "El transformador seleccionado no tiene código ERP"
                    );
                  }

                  const details = transformerDetails[
                    transformer.TransformadorId
                  ] || {
                    quantity: 1,
                    days: 15,
                  };

                  const operativeCosts = operativeCostsDetails[
                    transformer.TransformadorId
                  ] || {
                    shipping: { isPresent: false, amount: 0 },
                    startup: { isPresent: false, amount: 0 },
                  };

                  const transformerWithDetails = {
                    ...transformer,
                    TransformadorCantidad: details.quantity,
                    TransformadorDiasEntrega: details.days,
                    operativeCosts: operativeCosts,
                  };

                  addTransformer({
                    ...transformerWithDetails,
                    _meta: {
                      mode: isAppendMode
                        ? "append"
                        : isEditMode
                        ? "edit"
                        : "new",
                    },
                  });
                }}
                onRowUnselect={(e) => {
                  removeTransformer(e.data.TransformadorId);
                  setTransformerDetails((prev) => ({
                    ...prev,
                    [e.data.TransformadorId]: {
                      quantity: 1,
                      days: 15,
                      price: Number(e.data.TransformadorPrecio), // Reinicia al precio original
                    },
                  }));
                  setOperativeCostsDetails((prev) => ({
                    ...prev,
                    [e.data.TransformadorId]: {
                      shipping: { isPresent: false, amount: 0 },
                      startup: { isPresent: false, amount: 0 },
                    },
                  }));
                }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem" }}
                ></Column>
                <Column
                  header="CANTIDAD"
                  field="TransformadorCantidad"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedTransformers.length > 0 &&
                            selectedTransformers.find(
                              (t) =>
                                t.TransformadorId === rowData.TransformadorId
                            )
                              ? false
                              : true
                          }
                          value={
                            transformerDetails[rowData.TransformadorId]
                              ?.quantity || 1
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              rowData.TransformadorId,
                              Number.parseInt(e.target.value)
                            )
                          }
                        />
                      </section>
                    );
                  }}
                />
                <Column field="TransformadorMarca" header="MARCA" sortable />
                <Column
                  field="TransformadorCodigoSAP"
                  header="CODIGO ERP"
                  sortable
                  body={(rawData) => {
                    return (
                      <span>{rawData.TransformadorCodigoSAP || "--"}</span>
                    );
                  }}
                />
                <Column field="TransformadorNombre" header="NOMBRE" sortable />
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
                <Column field="TransformadorTipo" header="TIPO" sortable />
                {/* <Column
                  field="TransformadorStock"
                  header="STOCK"
                  sortable
                  body={(rowData) =>
                    Number.parseInt(rowData.TransformadorStock)
                  }
                /> */}
                <Column
                  header="FECHA DE ENTREGA"
                  field="TransformadorDiasEntrega"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedTransformers.length > 0 &&
                            selectedTransformers.find(
                              (t) =>
                                t.TransformadorId === rowData.TransformadorId
                            )
                              ? false
                              : true
                          }
                          value={
                            transformerDetails[rowData.TransformadorId]?.days ||
                            15
                          }
                          onChange={(e) =>
                            handleDaysChange(
                              rowData.TransformadorId,
                              e.target.value
                            )
                          }
                        />
                        <span>Dias</span>
                      </section>
                    );
                  }}
                />
                <Column
                  field="TransformadorPrecio"
                  header="PRECIO $"
                  sortable
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-24"
                          type="number"
                          disabled={
                            selectedTransformers.length > 0 &&
                            selectedTransformers.find(
                              (t) =>
                                t.TransformadorId === rowData.TransformadorId
                            )
                              ? false
                              : true
                          }
                          value={
                            transformerDetails[rowData.TransformadorId]
                              ?.price != undefined
                              ? transformerDetails[rowData.TransformadorId]
                                  ?.price
                              : rowData.TransformadorPrecio
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              handlePriceChange(
                                rowData.TransformadorId,
                                Number.parseFloat(value)
                              );
                            }
                          }}
                        />
                      </section>
                    );
                  }}
                />
                <Column
                  header="SERVICIOS ADICIONALES"
                  body={(rowData) => {
                    const isSelected =
                      selectedTransformers.length > 0 &&
                      selectedTransformers.find(
                        (t) => t.TransformadorId === rowData.TransformadorId
                      );
                    const isDisabled = !isSelected;
                    const operativeCosts = operativeCostsDetails[
                      rowData.TransformadorId
                    ] || {
                      shipping: { isPresent: false, amount: 0 },
                      startup: { isPresent: false, amount: 0 },
                    };

                    return (
                      <section className="min-w-[300px] space-y-3">
                        {/* Shipping Section */}
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Envío
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  operativeCosts.shipping?.isPresent || false
                                }
                                onChange={(e) =>
                                  handleOperativeCostChange(
                                    rowData.TransformadorId,
                                    "shipping",
                                    "isPresent",
                                    e.target.checked
                                  )
                                }
                                disabled={isDisabled}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></div>
                            </label>
                          </div>
                          {operativeCosts.shipping?.isPresent && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                              <div className="relative">
                                <InputNumber
                                  value={operativeCosts.shipping?.amount || 0}
                                  min={0}
                                  disabled={isDisabled}
                                  placeholder="Precio de envío"
                                  className="w-full"
                                  inputClassName="rounded-lg w-full pl-8 text-sm"
                                  onChange={(e) =>
                                    handleOperativeCostChange(
                                      rowData.TransformadorId,
                                      "shipping",
                                      "amount",
                                      e.value || 0
                                    )
                                  }
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                  {currency.symbol}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Startup Section */}
                        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Puesto en Marcha
                              </span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={
                                  operativeCosts.startup?.isPresent || false
                                }
                                onChange={(e) =>
                                  handleOperativeCostChange(
                                    rowData.TransformadorId,
                                    "startup",
                                    "isPresent",
                                    e.target.checked
                                  )
                                }
                                disabled={isDisabled}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-200 rounded-full peer transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
                              <div className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></div>
                            </label>
                          </div>
                          {operativeCosts.startup?.isPresent && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                              <div className="relative">
                                <InputNumber
                                  value={operativeCosts.startup?.amount || 0}
                                  min={0}
                                  disabled={isDisabled}
                                  placeholder="Precio de puesto en marcha"
                                  className="w-full"
                                  inputClassName="rounded-lg w-full pl-8 text-sm"
                                  onChange={(e) =>
                                    handleOperativeCostChange(
                                      rowData.TransformadorId,
                                      "startup",
                                      "amount",
                                      e.value || 0
                                    )
                                  }
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                  {currency.symbol}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                    );
                  }}
                />

                <Column
                  field=""
                  header=""
                  body={(rowData) => {
                    return selectedTransformers.length > 0 &&
                      selectedTransformers.find(
                        (st) => st.TransformadorId === rowData.TransformadorId
                      ) ? (
                      <section className="flex items-center gap-3 justify-center">
                        <CirclePlus
                          className="text-green-700 hover:cursor-pointer hover:scale-95 transition-transform duration-500 transform ease-in-out hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(rowData);
                            setOpenOptionalsModal(true);
                          }}
                        />
                      </section>
                    ) : (
                      <span></span>
                    );
                  }}
                />
              </DataTable>
            ) : (
              <div className="text-center py-4">No hay datos disponibles</div>
            )}
          </div>
        </div>
        {!isAppendMode && (
          <Discount
            setDiscount={setDiscount}
            discount={discount}
            isMargen={true}
          />
        )}
      </div>
      <TransformadorAccesoriosModal
        open={openOptionalsModal}
        setOpen={setOpenOptionalsModal}
        selectedItem={selectedItem}
        isAppendMode={isAppendMode}
        isEditMode={isEditMode}
      />
    </div>
  );
};
