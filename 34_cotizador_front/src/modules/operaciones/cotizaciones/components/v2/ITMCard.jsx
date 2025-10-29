import { cn } from "../../../../../utils/utils";
import { useExchange } from "../../hooks/useExchange";
import { useAuth } from "../../../../../hooks/useAuth";
import Roles from "../../../../../constants/Roles";

export const ITMCard = ({ itm, setSelectedITM, selected }) => {
  const { evalTypeChange, currency } = useExchange();

  const { user } = useAuth();

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-all duration-150 cursor-pointer bg-white",
        {
          "border-orange-400 border-dashed bg-orange-50": selected,
          "border-gray-200": !selected,
        }
      )}
      onClick={() => {
        if (selected) {
          setSelectedITM(null);
        } else {
          setSelectedITM(itm);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Seleccionar interruptor ${itm.sITMKit} de marca ${itm.sITMMarca}`}
    >
      {/* Header compacto */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {itm.sITMKit}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{itm.sITMMarca}</p>
        </div>
      </div>

      {/* Información esencial */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          <div className="flex space-x-1 mb-1">
            <section>
              <span className="font-medium">Amperaje:</span>
              <span className="ml-1">{itm?.nITMAmperaje || "--"}</span>
            </section>
            <section>
              <span className="font-medium">Polos:</span>
              <span className="ml-1">{itm?.nITMPolos || "--"}</span>
            </section>
          </div>
        </div>

        {user?.role !== Roles.EJECUTIVO_VENTAS && (
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {currency.code} {evalTypeChange(itm.nITMPrecioUSD)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
