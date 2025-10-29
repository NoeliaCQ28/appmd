// useEndOfTimeQuoteERP.js
import { useEffect, useRef, useState } from "react";

const useEndOfTimeQuoteERP = ({
  quantityItems,
  startEventName = "startTimer",
}) => {
  const fx = (q) => 0.2671 * q + 0.0243; // minutos por ítem

  const [label, setLabel] = useState("— esperando inicio —");
  const targetTs = useRef(null);
  const intervalId = useRef(null);

  const humanizeDiff = (diffSec) => {
    if (diffSec <= 0) return "En espera de respuesta por el ERP...";
    const hrs = Math.floor(diffSec / 3600);
    diffSec %= 3600;
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    const parts = [];
    if (hrs) parts.push(`${hrs} ${hrs === 1 ? "hora" : "horas"}`);
    if (mins) parts.push(`${mins} ${mins === 1 ? "minuto" : "minutos"}`);
    if (secs) parts.push(`${secs} ${secs === 1 ? "segundo" : "segundos"}`);
    if (parts.length > 1) {
      return `Faltan ${parts.slice(0, -1).join(", ")} y ${parts.slice(
        -1
      )} restantes aprox.`;
    }
    return `Faltan ${parts[0]} restantes aprox.`;
  };

  useEffect(() => {
    const onStart = () => {
      const minutos = fx(quantityItems);
      targetTs.current = Date.now() + minutos * 60 * 1000;
      if (intervalId.current) clearInterval(intervalId.current);

      // actualizamos inmediatamente y luego cada segundo
      const update = () => {
        const diff = Math.round((targetTs.current - Date.now()) / 1000);
        setLabel(humanizeDiff(diff));
      };
      update();
      intervalId.current = setInterval(update, 1000);
    };

    window.addEventListener(startEventName, onStart);
    return () => {
      window.removeEventListener(startEventName, onStart);
      clearInterval(intervalId.current);
    };
  }, [quantityItems, startEventName]);

  return { eot: label };
};

export default useEndOfTimeQuoteERP;
