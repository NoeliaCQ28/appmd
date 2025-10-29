import { useHeaderCotizacion } from "@hooks/useHeader";
import React from "react";

export const Header = ({ data, onSelectFilter }) => {
  const { SelectedHeader, setSelectHeader } = useHeaderCotizacion();

  React.useEffect(() => {
    onSelectFilter && onSelectFilter(SelectedHeader);
  }, [SelectedHeader, onSelectFilter]);

  return (
    <nav className="border-b border-gray-200 w-full overflow-auto">
      <div className="flex items-start flex-row space-x-8">
        {data.map((item) => (
          <button
            key={item}
            onClick={() => {
              setSelectHeader(item);
            }}
            className={`relative py-4 text-sm font-medium transition-colors hover:text-gray-900 text-nowrap
                         ${
                           SelectedHeader === item
                             ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-gray-900"
                             : "text-gray-500"
                         }`}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};
