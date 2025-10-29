import { X } from "lucide-react";
import { useITMs } from "../../hooks/v2/useITMs";

export const ITMConfigurationBadget = ({ itmId, onRemove }) => {
  const { itm, isLoadingITM, isErrorITM } =
    useITMs(itmId);

  if (isLoadingITM) {
    return <div>Cargando...</div>;
  }

  if (isErrorITM) {
    return <div>Error al cargar el ITM</div>;
  }

  return (
    <section className="inline-flex items-center gap-1.5 rounded-md text-blue-900 border border-blue-200 shadow-sm border-dashed">
      <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
        NUEVO
      </span>
      <div className="flex items-center gap-2 min-w-0 text-[10px]">
        <span className="truncate text-black">
          {itm?.sITMMarca}
        </span>
        <span className="text-blue-600 truncate font-bold">
          {itm?.KIT_ITM}
        </span>
      </div>
      <button
        onClick={onRemove}
        className="ml-0.5 p-0.5 hover:bg-blue-200/60 rounded-full transition-all duration-200 flex-shrink-0"
      >
        <X className="w-3 h-3 text-blue-600 hover:text-blue-800" />
      </button>
    </section>
  );
};
