import { Button } from "@components/custom/buttons/Button";
import { InputSearch } from "@components/custom/inputs/InputSearch";
import { Header } from "@components/Header";
import { HeadersCotizacion } from "@utils/utils";
import { Dropdown } from "primereact/dropdown";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { QuoteTableSkeleton } from "../../../../components/skeletons/QuoteTableSkeleton";
import { useAuth } from "../../../../hooks/useAuth";
import { useHeaderCotizacion } from "../../../../hooks/useHeader";
import { Table } from "../components/Table";
import { useCablesStore } from "../hooks/useCablesStore";
import { useCellsStore } from "../hooks/useCellsStore";
import useQuote from "../hooks/useQuote";
import { useTransformersStore } from "../hooks/useTransformersStore";
import { useQuotationStore } from "../store/useQuotationStore";
import { useGeneratorSetStore } from "../store/v2/useGeneratorSetStore";

export const CotizacionView = () => {
  const { data: user } = useAuth();

  const { data = [], isLoading } = useQuote();
  const { clearQuote, quotationType, setQuotationType, filter, setFilter } =
    useQuotationStore();
  const { clearGeneratorSetsAdded } = useGeneratorSetStore();
  const { clearCablesAdded } = useCablesStore();
  const { clearCellsAdded } = useCellsStore();
  const { clearTransformersAdded } = useTransformersStore();

  const quotesFiltered = useMemo(
    () =>
      user?.isAdmin
        ? data
        : filter.show === "me"
        ? data.filter((item) => item?.Usuario_Id === user?.id)
        : data,
    [data, filter.show, user?.id, user?.isAdmin]
  );

  const [filteredData, setFilteredData] = useState(quotesFiltered);

  useEffect(() => {
    setFilteredData(quotesFiltered);
  }, [quotesFiltered]);

  const handleSearch = useCallback(
    (term) => {
      const filtered = quotesFiltered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term.toLowerCase())
        )
      );
      setFilteredData(filtered);
    },
    [quotesFiltered]
  );
  const handleNewQuote = () => {
    // Limpiar el estado global de la cotización
    clearQuote();

    // Resetear al tipo por defecto
    setQuotationType(1); // Set default quotation type to 1 (GRUPOS ELECTROGENOS)

    // Limpiar todos los stores para asegurar un estado limpio
    clearGeneratorSetsAdded();
    clearCablesAdded();
    clearCellsAdded();
    clearTransformersAdded();
  };
  const { SelectedHeader } = useHeaderCotizacion();

  useEffect(() => {
    if (SelectedHeader === "Todo") {
      setFilteredData(quotesFiltered);
    } else {
      const quotesFilterByHeader = quotesFiltered.filter(
        (data) => data.nCotTipo === SelectedHeader
      );
      setFilteredData(quotesFilterByHeader);
    }
  }, [SelectedHeader, quotesFiltered]);

  return (
    <div className="w-full px-4 py-2">
      <Header data={HeadersCotizacion} />

      <div className="pt-6 w-full">
        <div className="space-y-4 flex flex-col sm:flex-row sm:space-x-4 sm:items-center sm:space-y-0 sm:justify-between">
          <div className="hidden sm:block sm:flex-1" aria-hidden="true"></div>

          <div className="flex w-full justify-center sm:w-auto sm:flex-none">
            <InputSearch
              type={"text"}
              placeholder={"Buscar cotización..."}
              onSearch={handleSearch}
            />
          </div>

          <div className="flex w-full sm:w-auto sm:justify-end sm:flex-1">
            <Link to={"/cotizaciones/crear"} className="w-full sm:w-auto">
              <Button onClick={handleNewQuote}>Agregar</Button>
            </Link>
          </div>
        </div>
        {!user?.isAdmin && (
          <section className="space-y-4 flex flex-row space-x-4 my-3">
            <Dropdown
              value={filter.show}
              onChange={(e) => setFilter({ ...filter, show: e.value })}
              options={[
                { name: "Todas", value: "all" },
                { name: "Mis Cotizaciones", value: "me" },
              ]}
              optionLabel="name"
              placeholder="Select a City"
              className="w-fit rounded-lg"
            />
          </section>
        )}
        {isLoading ? (
          <QuoteTableSkeleton />
        ) : (
          <Table filteredData={filteredData} />
        )}
      </div>
    </div>
  );
};
