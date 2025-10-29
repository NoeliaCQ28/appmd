import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "../../../../../utils/utils";
import { useExchange } from "../../hooks/useExchange";
import { useAuth } from "../../../../../hooks/useAuth";
import Roles from "../../../../../constants/Roles";

export const AlternatorCard = ({
  alternator,
  setSelectedAlternator,
  selected,
}) => {
  const [showDetails, setShowDetails] = useState(false);

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
          setSelectedAlternator(null);
        } else {
          setSelectedAlternator(alternator);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Seleccionar alternador ${alternator.sAltModelo} de marca ${alternator.sAltMarca}`}
    >
      {/* Header compacto */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {alternator.sAltModelo}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">{alternator.sAltMarca}</p>
        </div>
        {alternator.sAltFamilia && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded">
            {alternator.sAltFamilia}
          </span>
        )}
      </div>

      {/* Información esencial */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{alternator.sAltGradoIP}</span>
          {alternator.sAltAislamiento && (
            <span className="ml-2 text-gray-500">
              • {alternator.sAltAislamiento}
            </span>
          )}
          <div className="flex space-x-1 mb-1">
            <section>
              <span className="font-medium">Brida:</span>
              <span className="ml-1">{alternator?.nAltBrida || "--"}</span>
            </section>
            <section>
              <span className="font-medium">Disco:</span>
              <span className="ml-1">{alternator?.nAltDisco || "--"}</span>
            </section>
          </div>
        </div>

        {user?.role !== Roles.EJECUTIVO_VENTAS && (
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {currency.code} {evalTypeChange(alternator.nAltPrecioUSD)}
            </p>
          </div>
        )}
      </div>

      {/* Dropdown de detalles técnicos */}
      {(alternator.sAltSistemaExitacion ||
        alternator.sAltTarjetaAVR ||
        alternator.nAltPesoKg) && (
        <div className="border-t border-gray-100 pt-3">
          <button
            className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            aria-expanded={showDetails}
          >
            <span className="flex items-center">
              <Info size={14} className="mr-1.5" />
              Detalles técnicos
            </span>
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDetails && (
            <div className="mt-3 space-y-2 text-xs text-gray-600 bg-gray-50/50 p-3 rounded-md">
              {alternator.sAltSistemaExitacion && (
                <div>
                  <span className="font-medium">Excitación:</span>
                  <span className="ml-1">
                    {alternator.sAltSistemaExitacion}
                  </span>
                </div>
              )}

              {alternator.sAltTarjetaAVR && (
                <div>
                  <span className="font-medium">AVR:</span>
                  <span className="ml-1 break-words">
                    {alternator.sAltTarjetaAVR}
                  </span>
                </div>
              )}

              {alternator.nAltPesoKg &&
                parseFloat(alternator.nAltPesoKg) > 0 && (
                  <div>
                    <span className="font-medium">Peso:</span>
                    <span className="ml-1">{alternator.nAltPesoKg} kg</span>
                  </div>
                )}

              {alternator.sAltNormaTecnica && (
                <div>
                  <span className="font-medium">Normas:</span>
                  <span className="ml-1">{alternator.sAltNormaTecnica}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
