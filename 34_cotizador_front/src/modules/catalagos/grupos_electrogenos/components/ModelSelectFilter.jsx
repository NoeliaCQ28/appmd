import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { FormSelectText } from "../../../../components/custom/selects/FormSelectText";

export const ModelSelectFilter = ({ models, onChange, value, ...rest }) => {
  // Estado para el filtro de prefijo
  const [prefijoFiltro, setPrefijoFiltro] = useState("Todos");

  // Extraer los prefijos únicos (la parte antes del guion)
  const prefijosUnicos = Array.from(
    new Set(models.map((model) => model?.sModNombre.split("-")[0]))
  );

  // Opciones para el filtro de prefijo, incluyendo la opción "Todos"
  const opcionesPrefijo = ["Todos", ...prefijosUnicos];

  // Filtrar los modelos según el prefijo seleccionado
  const modelosFiltrados = models
    .filter(
      (model) =>
        prefijoFiltro === "Todos" ||
        model.sModNombre.split("-")[0] === prefijoFiltro
    )
    .map((model) => model.sModNombre);

  return (
    <div className="filtro-modelo">
      <label htmlFor="modelo" className="block text-sm font-medium text-black">
        MODELO
      </label>
      <div className="relative">
        {/* Contenedor del select de prefijo con ícono y flecha */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <div className="relative mt-[3px]">
            {/* Ícono de filtro */}
            <FaFilter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-200"
              aria-hidden="true"
              title="Filtrar por prefijo"
            />
            {/* Select de prefijo */}
            <select
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-l-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-lg"
              value={prefijoFiltro}
              onChange={(e) => setPrefijoFiltro(e.target.value)}
            >
              {opcionesPrefijo.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
            {/* Flechita del select */}
            <FaChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none transition-colors duration-200"
              aria-hidden="true"
            />
          </div>
        </div>
        {/* Componente principal para seleccionar el modelo, con padding para dejar espacio al select de prefijo */}
        <div className="pl-40">
          <FormSelectText
            id="modelo"
            label="" // La etiqueta ya se muestra arriba
            placeholder="Seleccione un modelo"
            parentClassName="w-full"
            options={["Todos", ...modelosFiltrados]}
            value={value}
            onChange={onChange}
            labelName="modelo_id"
            filter={true}
            {...rest}
          />
        </div>
      </div>
    </div>
  );
};
