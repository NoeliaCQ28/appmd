import { Header } from "@components/Header";
import { InputSearch } from "@components/custom/inputs/InputSearch";
import { HeadersPedidos } from "@utils/utils";
import React, { useState } from "react";
import { QuoteTableSkeleton } from "../../../../components/skeletons/QuoteTableSkeleton";
import useQuote from "../../cotizaciones/hooks/useQuote";
import { Table } from "./../../cotizaciones/components/Table";

export const PedidosView = () => {
  const { onlyOrdersQuotes = [], isLoadingOrders } = useQuote();
  const [headerFilter, setHeaderFilter] = useState("Todo");
  const [filteredDataByHeader, setFilteredDataByHeader] =
    useState(onlyOrdersQuotes);
  const [filteredData, setFilteredData] = useState(filteredDataByHeader);

  React.useEffect(() => {
    const filterByHeader = onlyOrdersQuotes.filter((item) => {
      if (headerFilter === "Todo") return true;
      return item.sCotEstado === headerFilter.toUpperCase();
    });
    setFilteredDataByHeader(filterByHeader);
  }, [headerFilter, onlyOrdersQuotes]);

  React.useEffect(() => {
    setFilteredData(filteredDataByHeader);
  }, [filteredDataByHeader]);

  const handleSearch = React.useCallback(
    (term) => {
      const filtered = filteredDataByHeader.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredData(filtered);
    },
    [filteredDataByHeader]
  );

  return (
    <div className="w-full px-4 py-2">
      <Header data={HeadersPedidos} onSelectFilter={setHeaderFilter} />

      <div className="pt-6 w-full">
        <div className="space-y-4 flex flex-col sm:flex-row sm:space-x-4 sm:items-center sm:space-y-0 sm:justify-center">
          {/* <div></div> */}

          <InputSearch
            type={"text"}
            placeholder={"Buscar en la tabla"}
            onSearch={handleSearch}
            className={
              "p-2 outline-none w-full md:w-96 pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500"
            }
            centered
          />
          {/* 
          <Link to="/cotizaciones/crear" className="justify-end">
            <Button type="button">Agregar</Button>
          </Link> */}
        </div>
        {isLoadingOrders ? (
          <QuoteTableSkeleton />
        ) : (
          <Table filteredData={filteredData} onERP={true} />
        )}
      </div>
    </div>
  );
};
