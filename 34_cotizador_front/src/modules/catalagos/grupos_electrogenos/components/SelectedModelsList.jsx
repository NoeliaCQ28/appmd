import { ChevronDown, ChevronUp, Copy, X } from "lucide-react";
import React from "react";
import { notify } from "../../../../utils/notifications";

export const SelectedModelsList = ({
  models = [],
  limit = 3,
  onRemove = () => {},
  onClear = () => {},
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const visible = React.useMemo(() => {
    if (!models.length) return [];
    return expanded ? models : models.slice(0, limit);
  }, [expanded, models, limit]);
  const remaining =
    models.length > limit && !expanded ? models.length - visible.length : 0;

  if (!models.length) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        models.map((m) => m.Modelo).join(", ")
      );
      notify.success("Modelos copiados");
    } catch (e) {
      notify.error(e);
    }
  };

  return (
  <div className="flex flex-col gap-1 w-full min-w-0">
      <div className="flex items-center gap-2 text-sm font-semibold text-black">
        <span className="flex items-center gap-1 text-gray-700 font-medium">
          Seleccionados
          <span className="inline-flex items-center justify-center text-xs font-semibold bg-blue-100 text-[#0055be] px-2 py-0.5 rounded-full min-w-[1.5rem]">
            {models.length}
          </span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="p-1 rounded-md hover:bg-blue-50 transition text-[#0055be] inline-flex"
          title="Copiar lista"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={() => onClear()}
          className="p-1 rounded-md hover:bg-red-50 transition text-red-600 inline-flex"
          title="Limpiar"
        >
          <X size={16} />
        </button>
        {models.length > limit && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded-md hover:bg-gray-100 transition text-gray-600 inline-flex"
            title={expanded ? "Mostrar menos" : "Ver todos"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      <div className="w-full relative">
        <ul
          className="flex flex-nowrap gap-2 w-full overflow-x-auto overflow-y-hidden py-1 pr-2 scrollbar-thin scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Modelos seleccionados"
        >
        {visible.map((m) => (
          <li
            key={m.ModeloGEId || m.Modelo}
            className="group flex items-center gap-1 bg-[#fff8ea] text-[#5c3f01] px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-amber-200 flex-shrink-0"
          >
            <span className="truncate max-w-[140px]" title={m.Modelo}>
              {m.Modelo}
            </span>
            <button
              type="button"
              onClick={() => onRemove(m)}
              className="opacity-60 group-hover:opacity-100 hover:text-red-600 transition"
              title="Quitar"
            >
              <X size={14} />
            </button>
          </li>
        ))}
        {remaining > 0 && !expanded && (
          <li className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="px-2 py-1 rounded-full bg-blue-50 text-[#0055be] text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition"
            >
              + {remaining} más
            </button>
          </li>
        )}
        {expanded && models.length > limit && (
          <li className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300 hover:bg-gray-200 transition"
            >
              Mostrar menos
            </button>
          </li>
        )}
        </ul>
      </div>
    </div>
  );
};

export default SelectedModelsList;
