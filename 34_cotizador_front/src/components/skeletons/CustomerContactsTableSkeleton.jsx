import React from "react";

export const CustomerContactsTableSkeleton = () => {
  return (
    <div className="w-full overflow-x-auto animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {["CONTACTO", "TELEFONO", "CARGO", "CORREO", "OPERACIONES"].map(
              (header, idx) => (
                <th
                  key={idx}
                  className="p-3 text-left text-sm font-semibold text-gray-500"
                >
                  <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200">
              {/* CONTACTO */}
              <td className="p-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </td>
              {/* TELEFONO */}
              <td className="p-3">
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              </td>
              {/* CARGO */}
              <td className="p-3">
                <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              </td>
              {/* CORREO */}
              <td className="p-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </td>
              {/* OPERACIONES (simulando iconos de editar/eliminar) */}
              <td className="p-3">
                <div className="flex space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Skeleton para la parte de paginación */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
