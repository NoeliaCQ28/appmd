import React from "react";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Badge } from "primereact/badge";
import { SkeletonAccordion } from "../../../../../components/skeletons/SkeletonAccordion";
import { useTransformers } from "../../hooks/useTransformers";

export const TransformadorAccesoriosForm = ({
  detailsAdded,
  addDetail,
  TransformadorId,
  addComponent = null,
  removeComponent = null,
  isEditMode = false,
}) => {
  const {
    accesorios = [],
    isLoadingAccesorios,
    errorAccesorios,
  } = useTransformers();

  const handleComponentChange = (e, itemMapped) => {
    e.stopPropagation();
    // NO usar preventDefault aquí para permitir que el checkbox se marque
    const isChecked = e.target.checked;

    if (isEditMode && addComponent && removeComponent) {
      if (isChecked) {
        addComponent(itemMapped);
      } else {
        removeComponent(itemMapped);
      }
    } else {
      // En modo normal, solo agregar cuando se marca (addDetail parece funcionar como toggle)
      addDetail(TransformadorId, itemMapped);
    }
  };

  const accesoriosGrouped = React.useMemo(() => {
    if (accesorios.length === 0) return [];

    return accesorios.reduce((acc, item) => {
      const key = item.sTraAccTipo;

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [accesorios]);

  const [filteredOptionalsGrouped, setFilteredOptionalsGrouped] =
    React.useState(accesoriosGrouped);

  React.useEffect(() => {
    setFilteredOptionalsGrouped(accesoriosGrouped);
  }, [accesoriosGrouped]);

  const selectedByType = React.useMemo(() => {
    if (detailsAdded.length === 0) return {};

    return accesorios.reduce((acc, item) => {
      if (detailsAdded.some((c) => c.id === item.TransformadorAccedorio_Id)) {
        const key = item.sTraAccTipo;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});
  }, [detailsAdded, accesorios]);

  const handleSearch = (term, type) => {
    const filtered = accesoriosGrouped[type].filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredOptionalsGrouped((prev) => {
      return {
        ...prev,
        [type]: filtered,
      };
    });
  };

  return (
    <div className="flex flex-col py-4">
      <div className="space-y-4">
        {isLoadingAccesorios ? (
          <SkeletonAccordion />
        ) : (
          <Accordion className="space-y-4">
            {Object.entries(filteredOptionalsGrouped).map(([type, items]) => (
              <AccordionTab
                header={
                  <span className="flex align-items-center gap-2 w-full">
                    <span className="font-bold white-space-nowrap">
                      {type === "" || type === null || type === undefined
                        ? "(SIN TIPO)"
                        : type}
                    </span>
                    <Badge
                      value={`${selectedByType[type] || 0}/${items.length}`}
                      className="ml-auto bg-blue-600"
                    />
                  </span>
                }
                contentClassName="mb-4 "
                className="space-y-4 shadow-lg"
                key={type}
              >
                <div className="flex justify-between items-center my-3">
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder={
                        type ? `Buscar en los componentes de ${type}` : `Buscar`
                      }
                      className="p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500"
                      onChange={(e) => handleSearch(e.target.value, type)}
                    />
                  </div>
                </div>
                <ul className="space-y-3">
                  {items
                    .sort((a, b) =>
                      a.sTraAccDescripcion.localeCompare(b.sTraAccDescripcion)
                    )
                    .map((item) => {
                      const {
                        TransformadorAccedorio_Id,
                        sTraAccDescripcion,
                        nTraAccPrecio,
                      } = item;

                      const itemMapped = {
                        id: TransformadorAccedorio_Id,
                        name: sTraAccDescripcion,
                        description: sTraAccDescripcion,
                        price: Number.parseFloat(nTraAccPrecio),
                      };

                      return (
                        <li
                          key={TransformadorAccedorio_Id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!isEditMode) {
                              addDetail(TransformadorId, itemMapped);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <h4 className="text-lg font-semibold text-gray-800">
                                {sTraAccDescripcion}
                              </h4>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="px-4 py-2 bg-green-50 rounded-lg">
                                <span className="text-xl font-semibold text-green-700">
                                  ${" "}
                                  {Number(nTraAccPrecio).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </div>
                              <input
                                type="checkbox"
                                checked={detailsAdded.some(
                                  (c) => c.id === itemMapped.id
                                )}
                                onChange={(e) => {
                                  handleComponentChange(e, itemMapped);
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="size-5 accent-green-600 cursor-pointer"
                              />
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </AccordionTab>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
