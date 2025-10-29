import { useExchange } from "../modules/operaciones/cotizaciones/hooks/useExchange";

export const CardResumen = ({
  items,
  total,
  discount,
  exportationCosts,
  isThroughput,
  marginPercentage,
  operativeCosts,
}) => {
  const { currency, evalTypeChange } = useExchange();

  const totalOperativeCosts =
    operativeCosts?.reduce((acc, oc) => acc + parseFloat(oc.value) || 0, 0) ||
    0;

  return (
    <div className="border p-6 rounded-xl border-gray-300 mt-5 bg-white border-dashed">
      <h2 className="text-xl font-semibold pb-4">Resumen</h2>
      <div className="border-b border-gray-500 pb-2">
        <ul className="grid gap-4 w-full">
          {items.map((item, index) => {
            const totalParcial = Number.parseFloat(item.parcial).toFixed(2);

            const hasAccesories = item.details?.length > 0;

            return (
              <li
                key={index}
                className="grid grid-cols-[1fr_auto] items-start gap-2 text-xs sm:text-sm"
              >
                <div className="text-gray-600 flex flex-col gap-1">
                  <span>{item.descripcion}</span>

                  {item.details?.length > 0 && (
                    <section className="mt-2 ml-4 pl-3 border-l-2 border-gray-300">
                      <label className="font-medium uppercase">
                        Accesorios
                      </label>
                      <ul className="flex flex-col gap-2 mt-1">
                        {item.details.map((detail, index) => (
                          <li
                            key={index}
                            className="text-gray-600 flex gap-2 items-center"
                          >
                            <span>{detail.descripcion}</span>
                            <span className="font-semibold ml-4 flex items-center gap-1">
                              <span>+ {currency.code}</span>
                              <span>{evalTypeChange(detail.parcial)}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {(item.operativeCosts?.shipping?.isPresent ||
                    item.operativeCosts?.startup?.isPresent) && (
                    <section className="mt-2 ml-4 pl-3 border-l-2 border-gray-300">
                      <label className="font-medium uppercase">Servicios</label>
                      <ul className="flex flex-col gap-2 mt-1">
                        {item.operativeCosts?.shipping?.isPresent && (
                          <li className="text-gray-600 flex gap-2 items-center">
                            <span>Costo de envio</span>
                            <span className="font-semibold ml-4 flex items-center gap-1">
                              <span>+ {currency.code}</span>
                              <span>
                                {evalTypeChange(
                                  item.operativeCosts.shipping.amount
                                )}
                              </span>
                            </span>
                          </li>
                        )}
                        {item.operativeCosts?.startup?.isPresent && (
                          <li className="text-gray-600 text-sm flex gap-2 items-center">
                            <span>Costo de puesto en marcha</span>
                            <span className="font-semibold ml-4">
                              + {currency.code}
                              {evalTypeChange(
                                item.operativeCosts.startup.amount
                              )}
                            </span>
                          </li>
                        )}
                      </ul>
                    </section>
                  )}
                </div>

                <span className="text-gray-600 justify-self-end flex items-center gap-1">
                  <span>{currency.code}</span>
                  <span>{evalTypeChange(totalParcial)}</span>
                  {hasAccesories && (
                    <div className="ml-1 text-blue-500 cursor-help relative group">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-8 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transition-opacity duration-200">
                        El precio incluye accesorios y servicios
                      </span>
                    </div>
                  )}
                </span>
              </li>
            );
          })}
          {exportationCosts?.incoterm?.category === "Flete y Seguros" &&
            exportationCosts?.marketName !== "NACIONAL" && (
              <>
                <li className="grid grid-cols-[1fr_auto] items-center text-sm">
                  <span className="uppercase text-gray-600 flex items-center gap-1">
                    <span>INCOTERM {exportationCosts?.incoterm?.code} -</span>
                    <span className=" text-gray-600 ml-1 normal-case">
                      {exportationCosts?.incoterm?.description}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1 py-[1px] text-[10px] font-medium text-slate-600">
                      Flete
                    </span>
                  </span>
                  <span className="text-gray-600 justify-self-end flex items-center gap-1">
                    <span>{currency.code}</span>
                    <span>
                      {evalTypeChange(
                        exportationCosts?.incoterm?.shippingCosts?.freight
                      )}
                    </span>
                  </span>
                </li>

                <li className="grid grid-cols-[1fr_auto] items-center text-sm">
                  <span className="uppercase text-gray-600 flex items-center gap-1">
                    <span>INCOTERM {exportationCosts?.incoterm?.code} -</span>
                    <span className=" text-gray-600 ml-1 normal-case">
                      {exportationCosts?.incoterm?.description}
                    </span>
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-1 py-[1px] text-[10px] font-medium text-slate-600">
                      Seguro
                    </span>
                  </span>
                  <span className="text-gray-600 justify-self-end flex items-center gap-1">
                    <span>{currency.code}</span>
                    <span>
                      {" "}
                      {evalTypeChange(
                        exportationCosts?.incoterm?.shippingCosts?.insurance
                      )}
                    </span>
                  </span>
                </li>
              </>
            )}

          {exportationCosts?.incoterm?.category === "Flete" &&
            exportationCosts?.marketName !== "NACIONAL" && (
              <li className="grid grid-cols-[1fr_auto] items-center text-sm">
                <span className="uppercase text-gray-600">
                  INCOTERM {exportationCosts?.incoterm?.code} -
                  <span className=" text-gray-600 font-semibold ml-1 normal-case">
                    {exportationCosts?.incoterm?.description}
                  </span>
                </span>
                <span className="text-gray-600 justify-self-end flex items-center gap-1">
                  <span>{currency.code}</span>
                  <span>
                    {evalTypeChange(
                      exportationCosts?.incoterm?.shippingCosts?.freight +
                        exportationCosts?.incoterm?.shippingCosts?.insurance
                    )}
                  </span>
                </span>
              </li>
            )}

          {discount !== 0 && (
            <li className="grid grid-cols-[1fr_auto] items-center">
              <span className="uppercase text-gray-600">
                {isThroughput ? "Margen del" : "Descuento"}
                {isThroughput && (
                  <span className=" text-gray-600 font-semibold ml-1 normal-case">
                    {marginPercentage}%
                  </span>
                )}
                {isThroughput && (
                  <span className="text-xs font-normal text-gray-500 ml-1 normal-case">
                    (Aplicado al material y costo de envío)
                  </span>
                )}
              </span>
              <span className="text-gray-600 justify-self-end flex items-center gap-1">
                <span>
                  {isThroughput ? "+" : "-"} {currency.code}
                </span>
                <span>{evalTypeChange(discount)}</span>
              </span>
            </li>
          )}
          {operativeCosts
            ?.filter((oc) => oc.value !== 0)
            .map((oc, index) => (
              <li
                className="grid grid-cols-[1fr_auto] items-center"
                key={index}
              >
                <span className="uppercase text-gray-600">{oc.label}</span>
                <div className="text-gray-600 justify-self-end flex items-center gap-1">
                  <span>{currency.code}</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(oc.value)}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <div className="pt-4 grid grid-cols-[1fr_auto] font-semibold">
        <span className="flex items-center gap-1">
          <span>TOTAL</span>
          <span className="text-xs font-normal text-gray-500 ml-1">
            (No incluye IGV)
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span>{currency.code}</span>
          <span>{evalTypeChange(total + totalOperativeCosts)}</span>
        </span>
      </div>
    </div>
  );
};
