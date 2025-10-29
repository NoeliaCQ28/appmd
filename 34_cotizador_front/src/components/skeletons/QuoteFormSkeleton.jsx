export const QuoteFormSkeleton = () => {
  return (
    <div className="p-6 w-full mx-auto animate-pulse">
      <div className="grid grid-cols-2 gap-4">
        {/* Primera columna */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>

        {/* Segunda columna */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>

          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Controles adicionales */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
        <div>
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Switches */}
      <div className="flex items-center space-x-4 mt-6">
        <div className="w-14 h-6 bg-gray-300 rounded"></div>
        <div className="w-14 h-6 bg-gray-300 rounded"></div>
      </div>

      {/* Botón */}
      <div className="mt-6">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
};
