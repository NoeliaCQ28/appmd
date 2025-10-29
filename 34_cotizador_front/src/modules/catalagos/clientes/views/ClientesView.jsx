import { InputSearch } from "@components/custom/inputs/InputSearch";
import { Header } from "@components/Header";
import { HeadersClientes } from "@utils/utils";
import React, { useState } from "react";
import { Button } from "../../../../components/custom/buttons/Button";
import { CustomersTableSkeleton } from "../../../../components/skeletons/CustomersTableSkeleton";
import { Table } from "../components/Table";
import useCustomer from "../hooks/useCustomer";
import { CreateCustomer } from "./CreateCustomer";

export const ClientesView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { data = [], isLoading, error } = useCustomer();

  const [filteredData, setFilteredData] = useState(
    () => data?.sort((a, b) => a.sCliNombre.localeCompare(b.sCliNombre)) || []
  );

  React.useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (term) => {
    const filtered = data.filter(
      (item) =>
        item.sCliNombre.toLowerCase().includes(term.toLowerCase()) ||
        item.sCliRucDni.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(
      filtered.sort((a, b) => a.sCliNombre.localeCompare(b.sCliNombre))
    );
  };

  return (
    <div className="w-full px-4 py-2">
      {!isOpen && <Header data={HeadersClientes} />}

      <div className="pt-6 w-full">
        {!isOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 mb-4">
            <div className="hidden sm:block"></div>

            <InputSearch
              type="text"
              placeholder="Buscar en la tabla"
              onSearch={handleSearch}
              className="p-2 outline-none w-full pl-9 bg-gray-100 border rounded-xl placeholder:text-gray-500 sm:w-96"
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              {/* <Button type="button" variant="tertiary" className="md:text-xs">
                SINCRONIZAR CON ERP
              </Button> */}
              <Button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  setSelectedItem(null);
                  setIsOpen(true);
                }}
              >
                Agregar
              </Button>
            </div>
          </div>
        )}
        {!isOpen ? (
          isLoading ? (
            <CustomersTableSkeleton />
          ) : filteredData.length === 0 ? (
            <div className="text-center py-4 text-gray-600">
              No se encontraron resultados
            </div>
          ) : (
            <Table
              filteredData={filteredData}
              setIsEditMode={setIsEditMode}
              setVisibility={setIsOpen}
              setSelectedEditItem={setSelectedItem}
              selectedEditItem={selectedItem}
            />
          )
        ) : (
          <CreateCustomer
            setVisibility={setIsOpen}
            isEditMode={isEditMode}
            selectedEditItem={selectedItem}
            key={isEditMode ? selectedItem?.Cliente_Id : "new"}
          />
        )}
      </div>
    </div>
  );
};
