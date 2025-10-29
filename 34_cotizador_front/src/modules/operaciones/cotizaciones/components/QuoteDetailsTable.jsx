/* eslint-disable react-hooks/rules-of-hooks */
import { CeilOperaciones } from "@components/CeilOperaciones";
import { getFilas } from "@utils/utils";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LuIterationCcw } from "react-icons/lu";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { FormInputText } from "../../../../components/custom/inputs/FormInputText";
import { ErrorComponent } from "../../../../components/error/ErrorComponent";
import { DeleteModal } from "../../../../components/modals/DeleteModal";
import { useCablesStore } from "../hooks/useCablesStore";
import { useCellsStore } from "../hooks/useCellsStore";
import { useElectrogenosStore } from "../hooks/useElectrogenosStore";
import { useExchange } from "../hooks/useExchange";
import { useTransformersStore } from "../hooks/useTransformersStore";
import { useQuoteDetailStore } from "../store/useQuoteDetailStore";
import { useGeneratorSetStore } from "../store/v2/useGeneratorSetStore";
import { composeName, evalPrices } from "../utils/v2/utils";
import { EditQuoteDetailModal } from "./forms/modals/EditQuoteDetailModal";

const placeholderItems = [
  {
    id: 1,
    item: "item",
    descripcion: "descripcion del item",
    ctd: "1",
    parcial: "1.00",
  },
  {
    id: 2,
    item: "item",
    descripcion: "descripcion del item",
    ctd: "1",
    parcial: "1.00",
  },
];

const getRowDetailsByQuotationType = (isEditMode, quotationType, details) => {
  switch (quotationType) {
    // Grupos Electrogenos
    case 1:
      return isEditMode
        ? details
          ?.filter((detail) => detail.quote_extra_details)
          ?.map((detail) => {
            const { quote_extra_details } = detail;

            const operativeCosts =
              (Number(
                detail?.quote_extra_details?.operativeCosts?.shipping?.amount
              ) || 0) +
              (Number(
                detail?.quote_extra_details?.operativeCosts?.startup?.amount
              ) || 0);

            const generatorSetPrice =
              Number.parseFloat(quote_extra_details.nPrecioFinal) || 0;
            const quantity = Number.parseInt(
              quote_extra_details.nIntCantidad || 0
            );

            return {
              id: detail.nCotDetItem || 0,
              item: detail.nCotDetItem,
              descripcion: `GRUPO ELECTROGENO, ${quote_extra_details.sModNombre
                }, ${quote_extra_details.nIntVoltaje}V, ${quote_extra_details.nIntFrecuencia
                }Hz, ${quote_extra_details.nIntFases}F, ${quote_extra_details.nIntFP
                }FP, ${quote_extra_details.nIntAltura}msnm, ${quote_extra_details.nIntTemperatura
                }°C, ${quote_extra_details.sITMMarca || "--"} ${quote_extra_details.sITMKitNombre || "--"}, ${quote_extra_details.nIntInsonoro === 1
                  ? "INSONORO"
                  : "ABIERTO"
                }`,
              ctd: quantity,
              precio: detail?.nCotDetPrecioUnitario || 0,
              parcial: detail?.nCotDetImporte || 0,
            };
          }) || []
        : details?.map((detail, index) => {
          const { finalPrice } = evalPrices(detail, detail.sMercadoNombre);

          return {
            id: detail.sIntKey,
            item: `${index + 1}`,
            descripcion: composeName(detail),
            ctd: detail.nIntCantidad || 1,
            precio: finalPrice,
            parcial: finalPrice * Number(detail.nIntCantidad || 1),
          };
        }) || [];
    // Cables
    case 2:
      return isEditMode
        ? details.map((detail, index) => {
          const { quote_extra_details } = detail;

          const operativeCosts =
            (Number(quote_extra_details?.operativeCosts?.shipping?.amount) ||
              0) +
            (Number(quote_extra_details?.operativeCosts?.startup?.amount) ||
              0);

          const unitPrice =
            Number(detail?.nCotDetPrecioUnitario) + operativeCosts;

          const quantity = Number.parseInt(quote_extra_details.CableCantidad);

          return {
            id: detail.nCotDetItem,
            item: detail.nCotDetItem,
            descripcion: `${quote_extra_details.CableNombre}, ${quote_extra_details.CableDescripcion}`,
            ctd: quantity.toFixed(0),
            precio: unitPrice,
            parcial: Number(unitPrice * quantity).toFixed(2),
          };
        })
        : details.map((detail, index) => {
          const operativeCosts =
            (Number(detail?.operativeCosts?.shipping?.amount) || 0) +
            (Number(detail?.operativeCosts?.startup?.amount) || 0);

          return {
            id: detail.CableId,
            item: `${index + 1}`,
            descripcion: `${detail.CableNombre}, ${detail.CableDescripcion}`,
            ctd: detail.CableCantidad,
            precio: detail.CablePrecio + operativeCosts,
            parcial:
              Number.parseFloat(detail.CablePrecio + operativeCosts) *
              Number.parseInt(detail.CableCantidad),
          };
        });
    // Celdas
    case 3:
      return isEditMode
        ? details.map((detail, index) => {
          const { quote_extra_details } = detail;

          const operativeCosts =
            (Number(quote_extra_details?.operativeCosts?.shipping?.amount) ||
              0) +
            (Number(quote_extra_details?.operativeCosts?.startup?.amount) ||
              0);

          const accesoriesTotalAmount =
            detail?.otherComponents?.reduce(
              (acc, item) => acc + Number.parseFloat(item.nCelAccPrecio),
              0
            ) || 0;

          const unitPrice =
            Number(detail?.nCotDetPrecioUnitario) + operativeCosts;

          const quantity = Number.parseInt(quote_extra_details.CeldaCantidad);

          return {
            id: detail.nCotDetItem,
            item: detail.nCotDetItem,
            descripcion: `${quote_extra_details?.CeldaDescripcion}, ${quote_extra_details?.CeldaDetalle}`,
            ctd: Number.parseInt(detail.nCotDetCantidad),
            precio: unitPrice,
            parcial: Number(unitPrice * quantity).toFixed(2),
          };
        })
        : details.map((cell, index) => {
          const accesoriosTotalAmount =
            cell?.details?.reduce(
              (acc, item) => acc + Number.parseFloat(item.price),
              0
            ) || 0;

          const operativeCosts =
            (Number(cell?.operativeCosts?.shipping?.amount) || 0) +
            (Number(cell?.operativeCosts?.startup?.amount) || 0);

          const unitPrice =
            Number.parseFloat(cell.CeldaPrecio) +
            operativeCosts +
            accesoriosTotalAmount;

          const quantity = Number.parseInt(cell.CeldaCantidad);

          return {
            id: cell.CeldaId,
            item: `${index + 1}`,
            descripcion: `${cell?.CeldaDescripcion}, ${cell?.CeldaDetalle}`,
            ctd: quantity,
            precio: unitPrice,
            parcial: unitPrice * quantity,
          };
        });
    // Transformadores
    case 4:
      return isEditMode
        ? details.map((detail, index) => {
          const { quote_extra_details } = detail;

          const operativeCosts =
            (Number(quote_extra_details.operativeCosts?.shipping?.amount) ||
              0) +
            (Number(quote_extra_details.operativeCosts?.startup?.amount) ||
              0);

          const accesoriesTotalAmount =
            detail?.otherComponents?.reduce(
              (acc, item) => acc + Number.parseFloat(item.nTraAccPrecio),
              0
            ) || 0;

          const unitPrice =
            Number(detail?.nCotDetPrecioUnitario) + operativeCosts;

          const quantity = Number.parseInt(
            quote_extra_details.TransformadorCantidad
          );

          const description =
            quote_extra_details?.TransformadorNombre != null &&
              quote_extra_details?.TransformadorNombre !== ""
              ? `${quote_extra_details?.TransformadorNombre}, ${quote_extra_details?.TransformadorDescripcion}`
              : quote_extra_details?.TransformadorDescripcion;

          return {
            id: detail.nCotDetItem,
            item: detail.nCotDetItem,
            descripcion: description,
            ctd: Number.parseInt(detail.nCotDetCantidad),
            precio: unitPrice,
            parcial: Number(unitPrice * quantity).toFixed(2),
          };
        })
        : details.map((transformer, index) => {
          const accesoriosTotalAmount =
            transformer?.details?.reduce(
              (acc, item) => acc + Number.parseFloat(item.price),
              0
            ) || 0;

          const operativeCosts =
            (Number(transformer?.operativeCosts?.shipping?.amount) || 0) +
            (Number(transformer?.operativeCosts?.startup?.amount) || 0);

          const unitPrice =
            Number.parseFloat(transformer.TransformadorPrecio) +
            operativeCosts +
            accesoriosTotalAmount;

          const quantity = Number.parseInt(
            transformer.TransformadorCantidad || 0
          );

          return {
            id: transformer.TransformadorId,
            item: `${index + 1}`,
            descripcion: `${transformer.TransformadorNombre}, ${transformer.TransformadorDescripcion}`,
            ctd: quantity,
            precio: unitPrice,
            parcial: unitPrice * quantity,
          };
        });

    default:
      return placeholderItems;
  }
};

export const QuoteDetailsTable = ({
  quotationType,
  details,
  isDetailsAvailable,
  isEditMode = false,
  onUpdateDetails,
  marketId,
}) => {
  const { initializeDetails } = useElectrogenosStore();
  const { removeGeneratorSet, updateQuantity: updateQuantityGeneratorSet } =
    useGeneratorSetStore();
  const {
    removeCable,
    updateQuantity: updateQuantityCable,
    initializeDetails: InitialCables,
  } = useCablesStore();
  const {
    removeCell,
    updateQuantity: updateQuantityCell,
    initializeDetails: InitialCeldas,
  } = useCellsStore();
  const {
    removeTransformer,
    updateQuantity: updateQuantityTransformer,
    initializeDetails: InitialTranformers,
  } = useTransformersStore();

  const { currency, evalTypeChange } = useExchange();

  //estado para manejar la actualizacion de la fila
  const [rows, setRows] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const { detailsForDelete, addDetailForDelete, removeDetailForDelete } =
    useQuoteDetailStore();
  const [openDeleteQuoteDetailModal, setOpenDeleteQuoteDetailModal] =
    React.useState(false);
  const [openEditQuoteDetailModal, setOpenEditQuoteDetailModal] =
    React.useState(false);
  const selectItemWithDetails = React.useMemo(() => {
    return details?.find((detail) => detail.nCotDetItem === selectedItem?.id);
  }, [details, selectedItem]);

  if (!isDetailsAvailable) {
    return null;
  }

  React.useEffect(() => {
    if (isEditMode && quotationType === 1 && details?.length > 0) {
      initializeDetails(details);
    } else if (isEditMode && quotationType === 2 && details?.length > 0) {
      InitialCables(details);
    } else if (isEditMode && quotationType === 3 && details?.length > 0) {
      InitialCeldas(details);
    } else if (isEditMode && quotationType === 4 && details?.length > 0) {
      InitialTranformers(details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, quotationType, details]);

  //estado para manejar la actualizacion de la fila
  React.useEffect(() => {
    const initialRows = getRowDetailsByQuotationType(
      isEditMode,
      quotationType,
      details
    );
    setRows(initialRows);
  }, [isEditMode, quotationType, details]);

  const handleDelete = (rowData) => {
    if (isEditMode) {
      addDetailForDelete({ id: rowData.id });
    } else {
      setSelectedItem(rowData);
      setOpenDeleteQuoteDetailModal(true);
    }
  };

  const removeItem = () => {
    if (!selectedItem) {
      return;
    }
    switch (quotationType) {
      case 1:
        removeGeneratorSet(selectedItem.id);
        break;
      case 2:
        removeCable(selectedItem.id);
        break;
      case 3:
        removeCell(selectedItem.id);
        break;
      case 4:
        removeTransformer(selectedItem.id);
        break;
      default:
        break;
    }
  };

  const updateItemQuantity = (id, quantity, isEdit = false) => {
    switch (quotationType) {
      // Grupos Electrogenos
      case 1:
        // update store
        updateQuantityGeneratorSet(id, quantity);

        // update parent details robustly (match by nCotDetItem or sIntKey)
        if (onUpdateDetails && details) {
          const updatedDetails = details.map((detail) => {
            const matches =
              String(detail.nCotDetItem) === String(id) ||
              String(detail.sIntKey) === String(id);

            if (matches) {
              const precioUnit =
                detail?.quote_extra_details?.nPrecioFinal ||
                detail?.nCotDetPrecioUnitario ||
                0;
              const newParcial = Number(precioUnit) * Number(quantity || 0);

              const newQuoteExtra = { ...(detail.quote_extra_details || {}) };
              // set possible quantity keys so code that reads different schemas works
              newQuoteExtra.nIntCantidad = quantity;
              newQuoteExtra.nCantidad = quantity;

              return {
                ...detail,
                nCotDetCantidad: String(quantity),
                nCotDetImporte: String(newParcial),
                quote_extra_details: newQuoteExtra,
              };
            }
            return detail;
          });

          onUpdateDetails(updatedDetails);

          // update local rows for immediate UI feedback
          setRows((prevRows) =>
            prevRows.map((row) =>
              String(row.id) === String(id)
                ? {
                  ...row,
                  ctd: quantity,
                  parcial: (row.precio || 0) * quantity,
                }
                : row
            )
          );
        }

        break;
      // Cables
      case 2:
        // update store
        updateQuantityCable(id, quantity);

        if (onUpdateDetails && details) {
          const updatedDetails = details.map((detail) => {
            const matches =
              String(detail.nCotDetItem) === String(id) ||
              String(detail.sIntKey) === String(id);

            if (matches) {
              const operativeCosts =
                (Number(
                  detail?.quote_extra_details?.operativeCosts?.shipping?.amount
                ) || 0) +
                (Number(
                  detail?.quote_extra_details?.operativeCosts?.startup?.amount
                ) || 0);

              const unitPrice =
                Number(detail?.quote_extra_details?.CablePrecio) +
                operativeCosts ||
                Number(detail?.nCotDetPrecioUnitario) + operativeCosts ||
                0;

              const newParcial = unitPrice * Number(quantity || 0);

              const newQuoteExtra = { ...(detail.quote_extra_details || {}) };
              newQuoteExtra.CableCantidad = quantity;
              newQuoteExtra.nCantidad = quantity;

              return {
                ...detail,
                nCotDetCantidad: String(quantity),
                nCotDetImporte: String(newParcial),
                quote_extra_details: newQuoteExtra,
              };
            }
            return detail;
          });

          onUpdateDetails(updatedDetails);

          setRows((prevRows) =>
            prevRows.map((row) =>
              String(row.id) === String(id)
                ? {
                  ...row,
                  ctd: quantity,
                  parcial: (row.precio || 0) * quantity,
                }
                : row
            )
          );
        }

        break;
      // Celdas
      case 3:
        updateQuantityCell(id, quantity);

        if (onUpdateDetails && details) {
          const updatedDetails = details.map((detail) => {
            const matches =
              String(detail.nCotDetItem) === String(id) ||
              String(detail.sIntKey) === String(id);

            if (matches) {
              const unitPrice =
                Number(detail?.quote_extra_details?.CeldaPrecio) ||
                Number(detail?.nCotDetPrecioUnitario) ||
                0;
              const newParcial = unitPrice * Number(quantity || 0);

              const newQuoteExtra = { ...(detail.quote_extra_details || {}) };
              newQuoteExtra.CeldaCantidad = quantity;
              newQuoteExtra.nCantidad = quantity;

              return {
                ...detail,
                nCotDetCantidad: String(quantity),
                nCotDetImporte: String(newParcial),
                quote_extra_details: newQuoteExtra,
              };
            }
            return detail;
          });

          onUpdateDetails(updatedDetails);

          setRows((prevRows) =>
            prevRows.map((row) =>
              String(row.id) === String(id)
                ? {
                  ...row,
                  ctd: quantity,
                  parcial: (row.precio || 0) * quantity,
                }
                : row
            )
          );
        }

        break;
      // Transformadores
      case 4:
        updateQuantityTransformer(id, quantity);

        if (onUpdateDetails && details) {
          const updatedDetails = details.map((detail) => {
            const matches =
              String(detail.nCotDetItem) === String(id) ||
              String(detail.sIntKey) === String(id);

            if (matches) {
              const unitPrice =
                Number(detail?.quote_extra_details?.TransformadorPrecio) ||
                Number(detail?.nCotDetPrecioUnitario) ||
                0;
              const newParcial = unitPrice * Number(quantity || 0);

              const newQuoteExtra = { ...(detail.quote_extra_details || {}) };
              newQuoteExtra.TransformadorCantidad = quantity;
              newQuoteExtra.nCantidad = quantity;

              return {
                ...detail,
                nCotDetCantidad: String(quantity),
                nCotDetImporte: String(newParcial),
                quote_extra_details: newQuoteExtra,
              };
            }
            return detail;
          });

          onUpdateDetails(updatedDetails);

          setRows((prevRows) =>
            prevRows.map((row) =>
              String(row.id) === String(id)
                ? {
                  ...row,
                  ctd: quantity,
                  parcial: (row.precio || 0) * quantity,
                }
                : row
            )
          );
        }

        break;
      default:
        break;
    }
  };

  const removeItemForDelete = (item) => {
    removeDetailForDelete(item.id);
  };

  const actions = (rowData) => {
    const isMarkToDelete = detailsForDelete.some(
      (detail) => detail.id === rowData.id
    );
    const quoteHasOneDetail = details?.length === 1 || false;

    return (
      <div className="flex space-x-2">
        <CeilOperaciones>
          {isEditMode &&
            (quotationType === 1 ||
              quotationType === 3 ||
              quotationType === 4) && (
              <MdModeEdit
                color="green"
                size={20}
                onClick={() => {
                  setSelectedItem(rowData);
                  setOpenEditQuoteDetailModal(true);
                }}
              />
            )}
        </CeilOperaciones>
        <CeilOperaciones>
          {isMarkToDelete ? (
            <LuIterationCcw
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeItemForDelete(rowData);
              }}
            />
          ) : (
            <RiDeleteBinLine
              color="red"
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                if (isEditMode && quoteHasOneDetail) {
                  toast.warning(
                    "No se puede eliminar el último detalle de la cotización"
                  );
                  return;
                }

                handleDelete(rowData);
              }}
            />
          )}
        </CeilOperaciones>
      </div>
    );
  };

  return (
    <section>
      <DataTable
        value={rows}
        tableStyle={{ minWidth: "50rem" }}
        paginator
        rows={10}
        rowsPerPageOptions={getFilas(rows)}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
      >
        <Column
          field="item"
          header="ITEM"
          className="font-medium"
          body={(_rowData, options) => options.rowIndex + 1}
        />
        <Column
          field="descripcion"
          header="DESCRIPCION"
          className="font-medium"
          body={(rowData) => {
            const isMarkToDelete = detailsForDelete.some(
              (detail) => detail.id === rowData.id
            );

            return (
              <div className="flex flex-col">
                <span className={isMarkToDelete && `line-through`}>
                  {rowData.descripcion}
                </span>
                {isMarkToDelete && (
                  <p className="text-sm text-red-600 font-semibold animate-pulse">
                    Marcado para eliminación
                  </p>
                )}
              </div>
            );
          }}
        />
        <Column
          field="ctd"
          header="CTD"
          className="font-medium"
          body={(rowData) => {
            return (
              <section className="flex items-center gap-3 justify-center">
                <FormInputText
                  label=""
                  className="w-14"
                  type="number"
                  // min={1}
                  // disabled={!isEditMode || isMarkToDelete}
                  value={rowData.ctd}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    // Si está vacío, permitir el valor vacío temporalmente
                    if (newValue === "") {
                      rowData.ctd = "";
                      const newRows = [...rows];
                      setRows(newRows);
                      return;
                    }

                    // Si es un número válido, actualizar
                    const newQuantity = parseInt(newValue);
                    if (!isNaN(newQuantity) && newQuantity > 0) {
                      updateItemQuantity(rowData.id, newQuantity, isEditMode);
                    }
                  }}
                />
              </section>
            );
          }}
        />
        <Column
          field="parcial"
          header="PRECIO"
          className="font-medium"
          body={(rowData) => {
            return (
              <div className="flex items-center gap-1">
                <span>{currency.code}</span>
                <span>{evalTypeChange(rowData.precio)}</span>
              </div>
            );
          }}
        />
        <Column
          field="parcial"
          header="PARCIAL"
          className="font-medium"
          body={(rowData) => {
            return (
              <div className="flex items-center gap-1">
                <span>{currency.code}</span>
                <span>{evalTypeChange(rowData.parcial)}</span>
              </div>
            );
          }}
        />
        <Column body={actions} className="font-medium" />
      </DataTable>
      <DeleteModal
        onConfirm={() => removeItem()}
        open={openDeleteQuoteDetailModal}
        setOpen={setOpenDeleteQuoteDetailModal}
      />

      {selectItemWithDetails && isEditMode && (
        <ErrorBoundary fallbackRender={ErrorComponent}>
          <EditQuoteDetailModal
            open={openEditQuoteDetailModal}
            setOpen={setOpenEditQuoteDetailModal}
            selectedItem={selectItemWithDetails}
            marketId={marketId}
          />
        </ErrorBoundary>
      )}
    </section>
  );
};
