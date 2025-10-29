import { InputSearch } from "@components/custom/inputs/InputSearch";
import { HeadersCotizacion } from "@utils/utils";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/custom/buttons/Button";
import { Header } from "../../../../components/Header";
import { CommercialConditionsTableSkeleton } from "../../../../components/skeletons/CommercialConditionsTableSkeleton";
import { searchInput } from "../../../../utils/utils";
import { Table } from "../components/Table";
import useComercialCondition from "../hooks/useComercialCondition";
import { useHeaderCotizacion } from "@hooks/useHeader";

export const CondicionesView = () => {
  const { data = [], isLoading, error } = useComercialCondition();

  const [searchTerm, setSearchTerm] = useState("");
  const { SelectedHeader } = useHeaderCotizacion();

  const handleSearch = (term) => {
    setSearchTerm(term || "");
  };

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];

    if (SelectedHeader && SelectedHeader !== "Todo") {
      result = result.filter((d) => d.sCotTipoNombre === SelectedHeader);
    }

    if (searchTerm && searchTerm.trim() !== "") {
      result = searchInput(result, searchTerm);
    }

    return result;
  }, [data, SelectedHeader, searchTerm]);

  return (
    <div className="w-full px-4 py-2">
      <Header data={HeadersCotizacion} />
      <div className="pt-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-4 pt-6">
          <div className="hidden sm:block"></div>

          <InputSearch
            type="text"
            placeholder="Buscar en la tabla"
            onSearch={handleSearch}
            className="p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-96"
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Link to={"/condiciones-comerciales/crear"}>
              <Button type="button">Agregar</Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <CommercialConditionsTableSkeleton />
        ) : filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No se encontraron resultados
          </div>
        ) : (
          <Table filteredData={filteredData} />
        )}
      </div>
    </div>
  );
};
