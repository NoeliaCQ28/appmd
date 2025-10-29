import { InputSearch } from "@components/custom/inputs/InputSearch";
import { FormSelectText } from "@components/custom/selects/FormSelectText";
import { getFilas, searchInput } from "@utils/utils";
import { Loader2, Truck, Wrench } from "lucide-react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "../../../../../components/custom/buttons/Button.jsx";
import { FormInputText } from "../../../../../components/custom/inputs/FormInputText.jsx";
import { Discount } from "../../../../../components/Discount.jsx";
import { useCables } from "../../hooks/useCables.js";
import { useCablesAddItemsStore } from "../../hooks/useCablesAddItemsStore.js";
import { useCablesStore } from "../../hooks/useCablesStore.js";
import { useExchange } from "../../hooks/useExchange.js";

export const CablesForm = ({ isEditMode = false }) => {
  const { params, isLoadingParams, search, cables, isLoadingCables } =
    useCables();
  const { control, reset, handleSubmit } = useForm();
  const { currency, evalTypeChange } = useExchange();

  const onSubmit = (data) => {
    search(data);
  };

  const {
    addCable: addNormalCable,
    updateCable: updateNormalCable,
    removeCable: removeNormalCable,
    updateOperativeCosts: updateNormalOperativeCosts,
    cablesAdded,
    setDiscount,
    discount,
  } = useCablesStore();

  const {
    cablesArray,
    addCable: addEditCable,
    updateCable: updateEditCable,
    removeCable: removeEditCable,
    updateOperativeCosts: updateEditOperativeCosts,
  } = useCablesAddItemsStore();

  // Seleccionar las funciones correctas según el modo
  const addCable = isEditMode ? addEditCable : addNormalCable;
  const updateCable = isEditMode ? updateEditCable : updateNormalCable;
  const removeCable = isEditMode ? removeEditCable : removeNormalCable;
  const updateOperativeCosts = isEditMode
    ? updateEditOperativeCosts
    : updateNormalOperativeCosts;

  const cablesItems = isEditMode ? cablesArray : cablesAdded;

  const [filteredSubItems, setFilteredSubItems] = useState(cables);
  const [selectedCables, setSelectedCables] = useState(cablesItems);

  const [cableDetails, setCableDetails] = useState({});
  const [operativeCostsDetails, setOperativeCostsDetails] = useState({});

  React.useEffect(() => {
    setFilteredSubItems(cables);
  }, [cables]);

  // Al cargar los cables, inicializa cada uno con cantidad 1 y días 15.
  React.useEffect(() => {
    if (!cables) return;

    setFilteredSubItems(cables);
    const defaults = {};
    const operativeDefaults = {};

    cables.forEach((cable) => {
      // Buscar si el cable ya existe en el array correspondiente
      const existingCable = cablesItems.find(
        (c) => c.CableId === cable.CableId
      );

      if (existingCable) {
        // Si existe, usar sus valores actuales
        defaults[cable.CableId] = {
          quantity: existingCable.CableCantidad || 1,
          days: existingCable.CableDiasEntrega || 15,
          price: existingCable.CablePrecio
            ? Number.parseFloat(existingCable.CablePrecio)
            : Number.parseFloat(cable.CablePrecio) || 0,
        };
        operativeDefaults[cable.CableId] = existingCable.operativeCosts || {
          shipping: { isPresent: false, amount: 0 },
          startup: { isPresent: false, amount: 0 },
        };
      } else {
        // Si no existe, usar valores predeterminados
        defaults[cable.CableId] = {
          quantity: 1,
          days: 15,
          price: Number.parseFloat(cable.CablePrecio) || 0,
        };
        operativeDefaults[cable.CableId] = {
          shipping: { isPresent: false, amount: 0 },
          startup: { isPresent: false, amount: 0 },
        };
      }
    });

    setCableDetails(defaults);
    setOperativeCostsDetails(operativeDefaults);
  }, [cables, cablesItems, isEditMode]);

  const handleSearch = (term) => {
    const filtered = searchInput(cables, term);
    setFilteredSubItems(filtered);
  };

  // Función para actualizar un cable ya seleccionado
  const updateSelectedCable = (cableId, field, value) => {
    setSelectedCables((prev) => {
      const updatedList = prev.map((cable) => {
        if (cable.CableId === cableId) {
          // Se conserva el objeto original y se actualiza solo el campo correspondiente.
          const updatedCable = { ...cable, [field]: Number(value) };
          // Actualizamos el store con el cable actualizado
          updateCable(updatedCable);
          return updatedCable;
        }
        return cable;
      });
      return updatedList;
    });
  };

  // Actualiza la cantidad y, si el cable está seleccionado, lo actualiza en la lista
  const handleQuantityChange = useCallback(
    (cableId, value) => {
      // Primero actualizamos los detalles del cable
      setCableDetails((prev) => ({
        ...prev,
        [cableId]: {
          ...prev[cableId],
          quantity: Number(value),
        },
      }));

      // Luego actualizamos el cable seleccionado si existe
      setSelectedCables((prevSelected) => {
        const cable = prevSelected.find((c) => c.CableId === cableId);
        if (cable) {
          const updatedCable = {
            ...cable,
            CableCantidad: Number(value),
            CableDiasEntrega: cable.CableDiasEntrega || 15,
          };
          updateCable(updatedCable);
          return prevSelected.map((c) =>
            c.CableId === cableId ? updatedCable : c
          );
        }
        return prevSelected;
      });
    },
    [updateCable]
  );

  // Actualiza los días y, si el cable está seleccionado, lo actualiza en la lista
  const handleDaysChange = useCallback(
    (cableId, value) => {
      // Primero actualizamos los detalles del cable
      setCableDetails((prev) => ({
        ...prev,
        [cableId]: {
          ...prev[cableId],
          days: Number(value),
        },
      }));

      // Luego actualizamos el cable seleccionado si existe
      setSelectedCables((prevSelected) => {
        const cable = prevSelected.find((c) => c.CableId === cableId);
        if (cable) {
          const updatedCable = {
            ...cable,
            CableCantidad: cable.CableCantidad || 1,
            CableDiasEntrega: Number(value),
          };
          updateCable(updatedCable);
          return prevSelected.map((c) =>
            c.CableId === cableId ? updatedCable : c
          );
        }
        return prevSelected;
      });
    },
    [updateCable]
  );

  const handlePriceChange = useCallback(
    (cableId, value) => {
      // Primero actualizamos los detalles del cable
      setCableDetails((prev) => ({
        ...prev,
        [cableId]: {
          ...prev[cableId],
          price: value === "" ? "" : Number(value),
        },
      }));

      // Luego actualizamos el cable seleccionado si existe
      setSelectedCables((prevSelected) => {
        const cable = prevSelected.find((c) => c.CableId === cableId);
        if (cable) {
          const updatedCable = {
            ...cable,
            CableCantidad: cable.CableCantidad || 1,
            CableDiasEntrega: cable.CableDiasEntrega || 15,
            CablePrecio: value === "" ? 0 : Number(value),
          };
          updateCable(updatedCable);
          return prevSelected.map((c) =>
            c.CableId === cableId ? updatedCable : c
          );
        }
        return prevSelected;
      });
    },
    [updateCable]
  );

  // Handler for updating operative costs of individual cables
  const handleOperativeCostChange = useCallback(
    (cableId, costType, field, value) => {
      // Update local state with proper defaults
      setOperativeCostsDetails((prev) => {
        const currentCostType = prev[cableId]?.[costType] || {};
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
          [cableId]: {
            ...prev[cableId],
            [costType]: updatedCostType,
          },
        };
      });

      // Update selected cable if it exists
      setSelectedCables((prevSelected) => {
        const cable = prevSelected.find((c) => c.CableId === cableId);
        if (cable) {
          const currentOperativeCosts = cable.operativeCosts || {};
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

          const updatedCable = {
            ...cable,
            // Preserve existing values to prevent NaN
            CableCantidad:
              cable.CableCantidad || cableDetails[cableId]?.quantity || 1,
            CableDiasEntrega:
              cable.CableDiasEntrega || cableDetails[cableId]?.days || 15,
            CablePrecio:
              cable.CablePrecio !== undefined
                ? cable.CablePrecio
                : cableDetails[cableId]?.price || 0,
            operativeCosts: updatedOperativeCosts,
          };
          updateCable(updatedCable);
          updateOperativeCosts(cableId, updatedOperativeCosts);
          return prevSelected.map((c) =>
            c.CableId === cableId ? updatedCable : c
          );
        }
        return prevSelected;
      });
    },
    [updateCable, updateOperativeCosts, cableDetails]
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
                        value: brand.sCabMarDescripcion,
                        label: brand.sCabMarDescripcion,
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
                    label={"Tipo de Cable"}
                    placeholder={"Seleccione un Tipo"}
                    options={[
                      { label: "Todos", value: "Todos" },
                      ...params.types.map((type) => ({
                        value: type.sCabMarDescripcion,
                        label: type.sCabMarDescripcion,
                      })),
                    ]}
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
                disabled={isLoadingParams}
              >
                {isLoadingCables ? (
                  <span>Buscando...</span>
                ) : (
                  <span>Consultar cables</span>
                )}

                {isLoadingCables && (
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
            disabled={isLoadingCables}
          />
          <div className="pt-0 md:p-4 w-full">
            {isLoadingCables ? (
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
                selection={selectedCables}
                onRowClick={(e) => e?.preventDefault()}
                onSelectionChange={(e) => setSelectedCables(e.value)}
                dataKey="CableId"
                onRowSelect={(e) => {
                  const cable = e.data;
                  if (!cable?.CableCodigoSAP) {
                    toast.warning("El cable seleccionado no tiene código ERP");
                  }

                  const details = cableDetails[cable.CableId] || {
                    quantity: 1,
                    days: 15,
                  };

                  const operativeCosts = operativeCostsDetails[
                    cable.CableId
                  ] || {
                    shipping: { isPresent: false, amount: 0 },
                    startup: { isPresent: false, amount: 0 },
                  };

                  const cableWithDetails = {
                    ...cable,
                    CableCantidad: details.quantity,
                    CableDiasEntrega: details.days,
                    operativeCosts: operativeCosts,
                  };

                  addCable(cableWithDetails);
                }}
                onRowUnselect={(e) => {
                  removeCable(e.data.CableId);
                  setCableDetails((prev) => ({
                    ...prev,
                    [e.data.CableId]: {
                      quantity: 1,
                      days: 15,
                      price: Number(e.data.CablePrecio), // Reinicia al precio original
                    },
                  }));
                  setOperativeCostsDetails((prev) => ({
                    ...prev,
                    [e.data.CableId]: {
                      shipping: { isPresent: false, amount: 0 },
                      startup: { isPresent: false, amount: 0 },
                    },
                  }));
                }}
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3rem" }}
                  header={""}
                ></Column>
                <Column
                  header="CANTIDAD"
                  field="CableCantidad"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedCables.length > 0 &&
                            selectedCables.find(
                              (c) => c.CableId === rowData.CableId
                            )
                              ? false
                              : true
                          }
                          value={cableDetails[rowData.CableId]?.quantity || 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              rowData.CableId,
                              Number.parseInt(e.target.value)
                            )
                          }
                        />
                      </section>
                    );
                  }}
                />
                <Column field="CableMarca" header="MARCA" sortable />
                <Column
                  field="CableCodigoSAP"
                  header="CODIGO ERP"
                  sortable
                  body={(rawData) => {
                    return <span>{rawData.CableCodigoSAP || "--"}</span>;
                  }}
                />
                <Column field="CableNombre" header="NOMBRE" sortable />
                <Column
                  field="CableDescripcion"
                  header="DESCRIPCION"
                  sortable
                  body={(rowData) => (
                    <section className="flex items-center">
                      <span className="max-w-80 overflow-x-auto line-clamp-2">
                        {rowData.CableDescripcion}
                      </span>
                    </section>
                  )}
                />
                <Column field="CableTipo" header="TIPO" sortable />
                <Column
                  field="CablePrecio"
                  header="PRECIO $"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-24"
                          type="number"
                          min={0}
                          disabled={
                            selectedCables.length > 0 &&
                            selectedCables.find(
                              (c) => c.CableId === rowData.CableId
                            )
                              ? false
                              : true
                          }
                          defaultValue={
                            cableDetails[rowData.CableId]?.price != undefined
                              ? cableDetails[rowData.CableId].price
                              : rowData.CablePrecio
                          }
                          onChange={(e) => {
                            // e.stopPropagation();
                            // e.preventDefault();

                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              handlePriceChange(
                                rowData.CableId,
                                value === "" ? "" : Number.parseFloat(value)
                              );
                            }
                          }}
                        />
                      </section>
                    );
                  }}
                />
                <Column
                  header="FECHA DE ENTREGA"
                  field="CableDiasEntrega"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedCables.length > 0 &&
                            selectedCables.find(
                              (c) => c.CableId === rowData.CableId
                            )
                              ? false
                              : true
                          }
                          value={cableDetails[rowData.CableId]?.days || 15}
                          onChange={(e) =>
                            handleDaysChange(rowData.CableId, e.target.value)
                          }
                        />
                        <span>Dias</span>
                      </section>
                    );
                  }}
                />
                <Column
                  header="SERVICIOS ADICIONALES"
                  body={(rowData) => {
                    const isSelected =
                      selectedCables.length > 0 &&
                      selectedCables.find((c) => c.CableId === rowData.CableId);
                    const isDisabled = !isSelected;
                    const operativeCosts = operativeCostsDetails[
                      rowData.CableId
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
                                    rowData.CableId,
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
                                      rowData.CableId,
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
                                    rowData.CableId,
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
                                      rowData.CableId,
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
              </DataTable>
            ) : (
              <div className="text-center py-4">No hay datos disponibles</div>
            )}
          </div>
        </div>
        {!isEditMode && (
          <Discount
            setDiscount={setDiscount}
            discount={discount}
            isMargen={true}
          />
        )}
      </div>
    </div>
  );
};
