import { Header } from "@components/Header";
import { InputSearch } from "@components/custom/inputs/InputSearch";
import { HeadersVendedores } from "@utils/utils";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { SellersTableSkeleton } from "../../../../components/skeletons/SellersTableSkeleton";
import { useHeaderCotizacion } from "../../../../hooks/useHeader";
import { searchInput } from "../../../../utils/utils";
import { Table } from "../components/Table";
import { VendedoresModal } from "../components/forms/modals/VendedoresModal";
import { useVendedores } from "../hooks/useVendedores";

export const VendedoresView = () => {
  const { data = [], isLoading, sincronizar, isSyncLoading } = useVendedores();
  const [filterHeaderTerm, setFilterHeaderTerm] = useState(
    HeadersVendedores[0]
  );

  const datafilteredByHeader = useMemo(() => {
    switch (filterHeaderTerm) {
      case "Todo":
        return data;
      case "Habilitado":
        return data?.filter((d) => d.nEjeEstado === 1);
      case "Deshabilitado":
        return data?.filter((d) => d.nEjeEstado === 0);
      default:
        return [];
    }
  }, [data, filterHeaderTerm]);

  const [filteredData, setFilteredData] = useState(
    () =>
      datafilteredByHeader?.sort((a, b) =>
        a.sEjeNombre.localeCompare(b.sEjeNombre)
      ) || []
  );

  React.useEffect(() => {
    setFilteredData(
      datafilteredByHeader?.sort((a, b) =>
        a.sEjeNombre.localeCompare(b.sEjeNombre)
      ) || []
    );
  }, [datafilteredByHeader]);

  const [VendedorVisible, setVendedorVisible] = useState(false);

  const handleSearch = (term) => {
    const filtered = searchInput(datafilteredByHeader, term);
    setFilteredData(
      filtered.sort((a, b) => a.sEjeNombre.localeCompare(b.sEjeNombre))
    );
  };

  const { SelectedHeader } = useHeaderCotizacion();

  React.useEffect(() => {
    setFilterHeaderTerm(SelectedHeader);
    handleSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectedHeader]);

  return (
    <div className="w-full px-4 py-2">
      <Header data={HeadersVendedores} />

      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-4 pt-6">
        <div className="hidden sm:block"></div>

        <InputSearch
          type="text"
          placeholder="Buscar en la tabla"
          onSearch={handleSearch}
          className="p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-96"
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="tertiary"
            className="md:text-xs md:w-fit"
            onClick={sincronizar}
            disabled={isSyncLoading}
          >
            {isSyncLoading ? "Sincronizando..." : "SINCRONIZAR CON ERP"}

            {isSyncLoading && (
              <Loader2
                data-testid="loader-icon"
                className="ml-2 animate-spin"
                width={22}
                height={22}
              />
            )}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setVendedorVisible(true);
            }}
          >
            Agregar
          </Button>
        </div>
      </div>

      <section className="w-full">
        {isLoading ? (
          <SellersTableSkeleton />
        ) : filteredData.length > 0 ? (
          <Table data={filteredData} />
        ) : (
          <div className="flex justify-center items-center h-64">
            <span className="text-gray-500">No se encontraron resultados</span>
          </div>
        )}
      </section>
      <VendedoresModal
        VendedorVisible={VendedorVisible}
        setVendedorVisible={setVendedorVisible}
      />
    </div>
  );
};
