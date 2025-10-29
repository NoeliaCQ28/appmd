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
import { useCells } from "../../hooks/useCells.js";
import { useCellsStore } from "../../hooks/useCellsStore.js";
import { useExchange } from "../../hooks/useExchange.js";
import { CellsAccesoriosModal } from "./modals/CellsAccesoriosModal.jsx";

export const CeldasForm = ({ isAppendMode = false }) => {
  const { params, isLoadingParams, search, cells, isLoadingCells } = useCells();
  const { control, reset, handleSubmit } = useForm();
  const { currency, evalTypeChange } = useExchange();

  const onSubmit = (data) => {
    search(data);
  };

  const {
    addCell,
    removeCell,
    cellsAdded,
    setDiscount,
    discount,
    updateCell,
    updateOperativeCosts,
  } = useCellsStore();

  const [filteredSubItems, setFilteredSubItems] = useState(cells);
  const [selectedCells, setSelectedCells] = useState(cellsAdded);

  React.useEffect(() => {
    setFilteredSubItems(cells);
  }, [cells]);

  const handleSearch = (term) => {
    const filtered = searchInput(cells, term);
    setFilteredSubItems(filtered);
  };

  // Estado para almacenar los detalles (cantidad y días) ingresados para cada celda
  const [cellDetails, setCellDetails] = useState({});
  const [operativeCostsDetails, setOperativeCostsDetails] = useState({});

  const [openOptionalsModal, setOpenOptionalsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Al cargar las celdas, inicializa cada una con cantidad 1 y días 15.
  React.useEffect(() => {
    if (!cells) return;

    setFilteredSubItems(cells);
    const defaults = {};
    const operativeDefaults = {};

    cells.forEach((cell) => {
      // Buscar si la celda ya existe en el array
      const existingCell = cellsAdded.find((c) => c.CeldaId === cell.CeldaId);

      if (existingCell) {
        // Si existe, usar sus valores actuales
        defaults[cell.CeldaId] = {
          quantity: existingCell.CeldaCantidad || 1,
          days: existingCell.CeldaDiasEntrega || 15,
          price: existingCell.CeldaPrecio
            ? Number.parseFloat(existingCell.CeldaPrecio)
            : Number.parseFloat(cell.CeldaPrecio) || 0,
        };
        operativeDefaults[cell.CeldaId] = existingCell.operativeCosts || {
          shipping: { isPresent: false, amount: 0 },
          startup: { isPresent: false, amount: 0 },
        };
      } else {
        // Si no existe, usar valores predeterminados
        defaults[cell.CeldaId] = {
          quantity: 1,
          days: 15,
          price: Number.parseFloat(cell.CeldaPrecio) || 0,
        };
        operativeDefaults[cell.CeldaId] = {
          shipping: { isPresent: false, amount: 0 },
          startup: { isPresent: false, amount: 0 },
        };
      }
    });

    setCellDetails(defaults);
    setOperativeCostsDetails(operativeDefaults);
  }, [cells, cellsAdded]);

  // Actualiza la cantidad y, si la celda está seleccionada, lo actualiza en la lista
  const handleQuantityChange = useCallback(
    (cellId, value) => {
      // Primero actualizamos los detalles de la celda
      setCellDetails((prev) => ({
        ...prev,
        [cellId]: {
          ...prev[cellId],
          quantity: Number(value),
        },
      }));

      // Luego actualizamos la celda seleccionada si existe
      setSelectedCells((prevSelected) => {
        const cell = prevSelected.find((c) => c.CeldaId === cellId);
        if (cell) {
          const updatedCell = {
            ...cell,
            CeldaCantidad: Number(value),
            CeldaDiasEntrega: cell.CeldaDiasEntrega || 15,
          };
          updateCell(updatedCell);
          return prevSelected.map((c) =>
            c.CeldaId === cellId ? updatedCell : c
          );
        }
        return prevSelected;
      });
    },
    [updateCell]
  );

  // Actualiza los días y, si la celda está seleccionada, lo actualiza en la lista
  const handleDaysChange = useCallback(
    (cellId, value) => {
      // Primero actualizamos los detalles de la celda
      setCellDetails((prev) => ({
        ...prev,
        [cellId]: {
          ...prev[cellId],
          days: Number(value),
        },
      }));

      // Luego actualizamos la celda seleccionada si existe
      setSelectedCells((prevSelected) => {
        const cell = prevSelected.find((c) => c.CeldaId === cellId);
        if (cell) {
          const updatedCell = {
            ...cell,
            CeldaCantidad: cell.CeldaCantidad || 1,
            CeldaDiasEntrega: Number(value),
          };
          updateCell(updatedCell);
          return prevSelected.map((c) =>
            c.CeldaId === cellId ? updatedCell : c
          );
        }
        return prevSelected;
      });
    },
    [updateCell]
  );

  const handlePriceChange = useCallback(
    (cellId, value) => {
      // Primero actualizamos los detalles de la celda
      setCellDetails((prev) => ({
        ...prev,
        [cellId]: {
          ...prev[cellId],
          price: value === "" ? "" : Number(value),
        },
      }));

      // Luego actualizamos la celda seleccionada si existe
      setSelectedCells((prevSelected) => {
        const cell = prevSelected.find((c) => c.CeldaId === cellId);
        if (cell) {
          const updatedCell = {
            ...cell,
            CeldaCantidad: cell.CeldaCantidad || 1,
            CeldaDiasEntrega: cell.CeldaDiasEntrega || 15,
            CeldaPrecio: value === "" ? 0 : Number(value),
          };
          updateCell(updatedCell);
          return prevSelected.map((c) =>
            c.CeldaId === cellId ? updatedCell : c
          );
        }
        return prevSelected;
      });
    },
    [updateCell]
  );

  // Handler for updating operative costs of individual cells
  const handleOperativeCostChange = useCallback(
    (cellId, costType, field, value) => {
      // Update local state with proper defaults
      setOperativeCostsDetails((prev) => {
        const currentCostType = prev[cellId]?.[costType] || {};
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
          [cellId]: {
            ...prev[cellId],
            [costType]: updatedCostType,
          },
        };
      });

      // Update selected cell if it exists
      setSelectedCells((prevSelected) => {
        const cell = prevSelected.find((c) => c.CeldaId === cellId);
        if (cell) {
          const currentOperativeCosts = cell.operativeCosts || {};
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

          const updatedCell = {
            ...cell,
            // Preserve existing values to prevent NaN
            CeldaCantidad:
              cell.CeldaCantidad || cellDetails[cellId]?.quantity || 1,
            CeldaDiasEntrega:
              cell.CeldaDiasEntrega || cellDetails[cellId]?.days || 15,
            CeldaPrecio:
              cell.CeldaPrecio !== undefined
                ? cell.CeldaPrecio
                : cellDetails[cellId]?.price || 0,
            operativeCosts: updatedOperativeCosts,
          };
          updateCell(updatedCell);
          updateOperativeCosts(cellId, updatedOperativeCosts);
          return prevSelected.map((c) =>
            c.CeldaId === cellId ? updatedCell : c
          );
        }
        return prevSelected;
      });
    },
    [updateCell, updateOperativeCosts, cellDetails]
  );

  return (
    <div className="flex flex-col py-4">
      <div className="space-y-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {isLoadingParams ? (
            <>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
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
                      "Todos",
                      ...params.brands.map((brand) => brand.sCelMarDescripcion),
                    ]}
                    disabled={isLoadingParams}
                    {...field}
                  />
                )}
              />
              <Controller
                name="model"
                control={control}
                rules={{ required: true }}
                defaultValue={"Todos"}
                render={({ field }) => (
                  <FormSelectText
                    label={"Modelo"}
                    placeholder={"Seleccione un Modelo"}
                    options={[
                      "Todos",
                      ...params.models.map((model) => model.sCeldaModeloNombre),
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
                    label={"Tipo de Celda"}
                    placeholder={"Seleccione un Tipo"}
                    options={["Todos", ...params.types]}
                    disabled={isLoadingParams}
                    {...field}
                  />
                )}
              />
            </>
          )}
          <section className="col-span-3 flex justify-end items-center">
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
                {isLoadingCells ? (
                  <span>Buscando...</span>
                ) : (
                  <span>Consultar celdas</span>
                )}
                {isLoadingCells && (
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
            disabled={isLoadingCells}
          />

          <div className="pt-0 md:p-4 w-full">
            {isLoadingCells ? (
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
                selection={selectedCells}
                onSelectionChange={(e) => setSelectedCells(e.value)}
                dataKey="CeldaId"
                onRowSelect={(e) => {
                  const cell = e.data;

                  if (
                    cell?.CeldaCodigoSAP === "" ||
                    cell?.CeldaCodigoSAP === null
                  ) {
                    toast.warning("La celda seleccionada no tiene código ERP");
                  }

                  const details = cellDetails[cell.CeldaId] || {
                    quantity: 1,
                    days: 15,
                  };

                  const operativeCosts = operativeCostsDetails[
                    cell.CeldaId
                  ] || {
                    shipping: { isPresent: false, amount: 0 },
                    startup: { isPresent: false, amount: 0 },
                  };

                  const cellWithDetails = {
                    ...cell,
                    CeldaCantidad: details.quantity,
                    CeldaDiasEntrega: details.days,
                    operativeCosts: operativeCosts,
                  };

                  addCell({
                    ...cellWithDetails,
                    _meta: {
                      mode: isAppendMode ? "append" : "new",
                    }
                  });
                }}
                onRowUnselect={(e) => {
                  removeCell(e.data.CeldaId);
                  setCellDetails((prev) => ({
                    ...prev,
                    [e.data.CeldaId]: {
                      quantity: 1,
                      days: 15,
                      price: Number(e.data.CeldaPrecio), // Reinicia al precio original
                    },
                  }));
                  setOperativeCostsDetails((prev) => ({
                    ...prev,
                    [e.data.CeldaId]: {
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
                  field="CeldaCantidad"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedCells.length > 0 &&
                            selectedCells.find(
                              (t) => t.CeldaId === rowData.CeldaId
                            )
                              ? false
                              : true
                          }
                          value={cellDetails[rowData.CeldaId]?.quantity || 1}
                          onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            handleQuantityChange(
                              rowData.CeldaId,
                              Number.parseInt(e.target.value)
                            );
                          }}
                        />
                      </section>
                    );
                  }}
                />
                <Column field="CeldaMarca" header="MARCA" sortable />
                <Column
                  field="CeldaCodigoSAP"
                  header="CODIGO ERP"
                  sortable
                  body={(rawData) => {
                    return <span>{rawData.CeldaCodigoSAP || "--"}</span>;
                  }}
                />

                <Column
                  field="CeldaDescripcion" // Nombre
                  header="DESCRIPCION"
                  sortable
                />

                <Column
                  field="CeldaDetalle"
                  header="DETALLE"
                  sortable
                  body={(rowData) => (
                    <section className="flex items-center">
                      <span className="max-w-80 overflow-x-auto line-clamp-2 ">
                        {rowData?.CeldaDetalle}
                      </span>
                    </section>
                  )}
                />
                <Column field="CeldaTipo" header="TIPO" sortable />
                <Column
                  field="CeldaPrecio"
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
                            selectedCells.length > 0 &&
                            selectedCells.find(
                              (c) => c.CeldaId === rowData.CeldaId
                            )
                              ? false
                              : true
                          }
                          defaultValue={
                            cellDetails[rowData.CeldaId]?.price != undefined
                              ? cellDetails[rowData.CeldaId].price
                              : rowData.CeldaPrecio
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || /^\d*\.?\d*$/.test(value)) {
                              handlePriceChange(
                                rowData.CeldaId,
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
                  field="CeldaDiasEntrega"
                  body={(rowData) => {
                    return (
                      <section className="flex items-center gap-3 justify-center">
                        <FormInputText
                          label=""
                          className="w-14"
                          type="number"
                          disabled={
                            selectedCells.length > 0 &&
                            selectedCells.find(
                              (t) => t.CeldaId === rowData.CeldaId
                            )
                              ? false
                              : true
                          }
                          value={cellDetails[rowData.CeldaId]?.days || 15}
                          onChange={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            handleDaysChange(rowData.CeldaId, e.target.value);
                          }}
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
                      selectedCells.length > 0 &&
                      selectedCells.find((c) => c.CeldaId === rowData.CeldaId);
                    const isDisabled = !isSelected;
                    const operativeCosts = operativeCostsDetails[
                      rowData.CeldaId
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
                                    rowData.CeldaId,
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
                                      rowData.CeldaId,
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
                                    rowData.CeldaId,
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
                                      rowData.CeldaId,
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
                    return selectedCells.length > 0 &&
                      selectedCells.find(
                        (st) => st.CeldaId === rowData.CeldaId
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
            defaultValues={[20, 25, 30]}
          />
        )}
      </div>
      <CellsAccesoriosModal
        open={openOptionalsModal}
        setOpen={setOpenOptionalsModal}
        selectedItem={selectedItem}
        isAppendMode={isAppendMode}
      />
    </div>
  );
};
