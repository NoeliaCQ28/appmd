import React from "react";

export const CustomerFormSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {/* EJECUTIVO */}
        <div className="flex flex-col space-y-2">
          {/* Etiqueta */}
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          {/* Campo */}
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* PROCEDENCIA DE CLIENTE */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-3/5 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* TIPO DE CLIENTE */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* N° de identificación fiscal */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* RAZÓN SOCIAL */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* DIRECCIÓN */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* TELÉFONO */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* CORREO */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* PAÍS */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* DEPARTAMENTO */}
        <div className="flex flex-col space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>

        {/* PROVINCIA (ocupa toda la fila en pantallas grandes) */}
        <div className="flex flex-col space-y-2 md:col-span-2">
          <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};
