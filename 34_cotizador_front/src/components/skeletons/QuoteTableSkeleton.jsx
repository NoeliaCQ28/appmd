export const QuoteTableSkeleton = () => {
  return (
    <div className="w-full animate-pulse my-3">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            {["NRO", "FECHA", "PRODUCTO", "CLIENTE", "IMPORTE", "ESTADO"].map(
              (header, index) => (
                <th key={index} className="px-4 py-3 border border-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <td key={i} className="px-4 py-3 border border-gray-200">
                      <div className="h-4 bg-gray-300 rounded w-5/6 mx-auto"></div>
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
