import React from "react";
import { useOptionals } from "../../hooks/useOptionals";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Badge } from "primereact/badge";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorComponent } from "../../../../../components/error/ErrorComponent";
import { SkeletonAccordion } from "../../../../../components/skeletons/SkeletonAccordion";
import { cn } from "../../../../../utils/utils";
import { useExchange } from "../../hooks/useExchange";
import { InputSearch } from "../../../../../components/custom/inputs/InputSearch";

export const AccessoriesGeneratorSetList = ({
  components,
  addComponent,
  removeComponent,
  integradoraId,
}) => {
  const {
    optionals = [],
    isLoading: isLoadingOptionals,
    error: errorOptionals,
  } = useOptionals({ integradoraId });

  const { currency, evalTypeChange } = useExchange();

  const optionalsGrouped = React.useMemo(() => {
    if (optionals.length === 0) return [];

    return optionals.reduce((acc, item) => {
      const key = item.Tipo;

      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [optionals]);

  const [filteredOptionalsGrouped, setFilteredOptionalsGrouped] =
    React.useState(optionalsGrouped);

  React.useEffect(() => {
    setFilteredOptionalsGrouped(optionalsGrouped);
  }, [optionalsGrouped]);

  const selectedByType = React.useMemo(() => {
    if (components.length === 0) return {};

    return optionals.reduce((acc, item) => {
      if (components.some((c) => c.id === item.Opcionales_Id)) {
        const key = item.Tipo;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});
  }, [components, optionals]);

  const handleSearch = (term, type) => {
    const filtered = optionalsGrouped[type].filter((row) =>
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
        {isLoadingOptionals ? (
          <SkeletonAccordion />
        ) : (
          <Accordion className="space-y-4">
            {Object.entries(filteredOptionalsGrouped).map(([type, items]) => (
              <AccordionTab
                header={
                  <span className="flex align-items-center gap-2 w-full">
                    <span className="font-bold white-space-nowrap">{type}</span>
                    <Badge
                      value={`${selectedByType[type] || 0}/${items.length}`}
                      className="ml-auto bg-[#0056b8]"
                    />
                  </span>
                }
                contentClassName="mb-4 "
                className="space-y-4"
                key={type}
              >
                <div className="flex justify-between items-center my-3">
                  <InputSearch
                    type={"text"}
                    placeholder={`Buscar ${type.toLowerCase()}...`}
                    centered
                    onSearch={(term) => handleSearch(term, type)}
                  />
                </div>
                <ErrorBoundary fallbackRender={ErrorComponent}>
                  <ul className="space-y-3 max-h-[60vh] overflow-y-auto scroll-mask-white ">
                    {items
                      .sort((a, b) => a.sOpcNombre.localeCompare(b.sOpcNombre))
                      .map((item) => {
                        const {
                          Opcionales_Id,
                          Nombre,
                          sOpcNombre,
                          sOpcDescripcion,
                          sOpcMarca,
                          nOpcPrecio,
                          nOpcValorEstandar,
                          sOpcFabricacion,
                        } = item;

                        const itemMapped = {
                          id: Opcionales_Id,
                          name: sOpcNombre,
                          description: sOpcDescripcion,
                          price: Number.parseFloat(nOpcPrecio),
                        };

                        return (
                          <li
                            key={Opcionales_Id}
                            className={cn(
                              "p-4 border rounded-lg transition-colors cursor-pointer",
                              components.some(
                                (c) =>
                                  Number.parseInt(c.id) ===
                                  Number.parseInt(itemMapped.id)
                              ) && "border-green-600 bg-green-50"
                            )}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <h4 className="text-lg font-semibold text-gray-800">
                                  {Nombre}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Marca GE: {item?.sOpcMarcaGE} - Aplicable a{" "}
                                  {item?.nOpcAplicacion}
                                </p>
                                {item?.sOpcModeloGE && (
                                  <p className="text-sm text-gray-600">
                                    Modelo GE : {item.sOpcModeloGE}
                                  </p>
                                )}

                                <section className="flex flex-wrap gap-2">
                                  <span className="inline-block px-2 py-1 text-xs bg-[#fffcf7] text-[#a5660f] rounded-full border border-[#ffca80]">
                                    Marca: {sOpcMarca}
                                  </span>
                                  <span className="inline-block px-2 py-1 text-xs bg-[#fffcf7] text-[#a5660f] rounded-full border border-[#ffca80]">
                                    Fabricación: {sOpcFabricacion}
                                  </span>
                                </section>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="px-4 py-2 rounded-lg">
                                  <span className="text-xl font-semibold text-green-700">
                                    {nOpcValorEstandar === 1 ? (
                                      <section className="flex flex-col items-end">
                                        <p>ESTANDAR</p>
                                        <p className="text-xs text-slate-600">
                                          Incluido en el equipo
                                        </p>
                                      </section>
                                    ) : (
                                      <span>
                                        {currency.code}{" "}
                                        {evalTypeChange(nOpcPrecio)}
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <input
                                  type="checkbox"
                                  checked={components.some(
                                    (c) =>
                                      Number.parseInt(c.id) ===
                                      Number.parseInt(itemMapped.id)
                                  )}
                                  onChange={(e) => {
                                    // e.stopPropagation();
                                    // e.preventDefault();
                                    if (e.target.checked) {
                                      addComponent(itemMapped);
                                    } else {
                                      removeComponent(itemMapped);
                                    }
                                  }}
                                  className="size-5 accent-green-600 cursor-pointer"
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </ErrorBoundary>
              </AccordionTab>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
