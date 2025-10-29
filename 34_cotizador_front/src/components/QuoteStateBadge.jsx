import React from "react";
import { Tooltip } from "./Tooltip";

const STATES_STYLES = Object.freeze({
  BORRADOR: "bg-[#e6e6e6] text-[#848484]",
  "APROBACIÓN DE DESCUENTO": "bg-yellow-500 text-white",
  REGISTRADA: "bg-[#ffeccc] text-[#aa7826]",
  "POR APROBAR": "bg-[#ffe0e0] text-[#ff1f31]",
  RECHAZADA: "bg-[#ff1f31] text-white",
  "EN PEDIDO": "bg-[#e1e0ff] text-[#2a6fca]", // ENVIADO A SAP
  "EN PROCESO": "bg-[#ffeccc] text-[#aa7826]",
  PROCESADO: "bg-[#e9ffe0] text-[#289900]",
  ENTREGADO: "bg-[#e1e0ff] text-[#2a6fca]",
});

export const QuoteStateBadge = ({ state }) => {
  const style = STATES_STYLES[state.toUpperCase()] || "bg-gray-500 text-white";

  const stateTitle =
    state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();

  const BadgeContent = () => (
    <div
      className={`quote-state flex items-center w-32 px-2 py-1 rounded-full text-xs sm:text-sm ${style} font-semibold`}
    >
      <span className="mr-2">•</span>

      <span>
        {stateTitle.length > 10 ? stateTitle.slice(0, 10) + "..." : stateTitle}
      </span>
    </div>
  );

  if (state.toUpperCase() === "EN PEDIDO") {
    return (
      <Tooltip text={"Pedido enviado al ERP"}>
        <BadgeContent />
      </Tooltip>
    );
  }

  if (stateTitle.length > 10) {
    return (
      <Tooltip text={stateTitle}>
        <BadgeContent />
      </Tooltip>
    );
  }

  return <BadgeContent />;
};
