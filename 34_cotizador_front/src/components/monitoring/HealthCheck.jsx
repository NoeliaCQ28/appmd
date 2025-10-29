import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const RAW_API = import.meta.env.VITE_API_URL;
// e.g. "http://54.83.80.78/proyectos/dev-cotizador-api/api"
const url = new URL(RAW_API);
const SOCKET_HOST = `${url.protocol}//${url.host}`;
// → "http://54.83.80.78"
// Mismos ambientes:
const NAMESPACES = {
  local: "", // Traefik expone en "/socket.io"
  development: "/proyectos/dev-cotizador-api",
  production: "",
};
const NODE_ENV = import.meta.env.VITE_NODE_ENV;
const PREFIX = NAMESPACES[NODE_ENV] || "";
// Luego el path a socket.io es:
const SOCKET_PATH = `${PREFIX}/socket.io`;

export const HealthCheck = ({ serverName, alias }) => {
  const [status, setStatus] = useState({
    socket: "connecting", // connecting | connected | reconnecting | disconnected | error
    health: "unknown",
    ts: null,
    id: null,
    attempt: 0, // Nº de intento de conexión / reconexión
  });

  // Referencia para evitar múltiples timers
  const retryTimerRef = useRef(null);
  const healthTimerRef = useRef(null); // Timeout para esperar primer evento de salud
  const watchdogRef = useRef(null); // Intervalo para detectar estado zombie
  const socketRef = useRef(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;

    // Backoff exponencial controlado manualmente para tener reconexiones infinitas.
    const baseDelay = 1000; // 1s
    const maxDelay = 15000; // 15s tope

    const connect = (attempt = 0) => {
      // Limpia socket previo si existiera
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.close();
      }

      setStatus((s) => ({
        ...s,
        socket: attempt === 0 ? "connecting" : "reconnecting",
        // Reseteamos a unknown para forzar validación; si no llega evento se marcará 'down'
        health: "unknown",
        attempt,
      }));

      const socket = io(SOCKET_HOST, {
        path: SOCKET_PATH,
        transports: ["websocket"],
        reconnection: false, // Desactivamos la interna para controlar nosotros
        forceNew: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        // Arranca timeout para primer evento health
        if (healthTimerRef.current) clearTimeout(healthTimerRef.current);
        healthTimerRef.current = setTimeout(() => {
          setStatus((s) => {
            if (s.health === "unknown" && s.socket === "connected") {
              return { ...s, health: "down" }; // No llegó evento -> asumimos caído
            }
            return s;
          });
        }, 5000); // 5s
        // Watchdog: si permanece unknown 15s forzamos reconexión completa
        if (watchdogRef.current) clearInterval(watchdogRef.current);
        watchdogRef.current = setInterval(() => {
          setStatus((s) => {
            if (
              s.socket === "connected" &&
              s.health === "unknown" &&
              s.attempt === 0
            ) {
              // Fuerza reconexión: cerramos socket y llamamos connect( attempt + 1 )
              if (socketRef.current) {
                socketRef.current.off();
                socketRef.current.close();
              }
              // Programamos reconexión inmediata
              connect(1);
              return { ...s, socket: "reconnecting" };
            }
            return s;
          });
        }, 15000);
        setStatus((s) => ({
          ...s,
          socket: "connected",
          id: socket.id,
          attempt: 0,
        }));
      });

      socket.on("disconnect", (reason) => {
        if (unmountedRef.current) return; // Evita reconectar tras unmount
        // Programar reconexión
        scheduleReconnect();
        if (healthTimerRef.current) {
          clearTimeout(healthTimerRef.current);
          healthTimerRef.current = null;
        }
        setStatus((s) => ({ ...s, socket: "disconnected", health: "down" }));
      });

      socket.on("connect_error", () => {
        if (unmountedRef.current) return;
        scheduleReconnect();
        setStatus((s) => ({ ...s, health: "down" }));
      });

      socket.on("error", () => {
        if (unmountedRef.current) return;
        setStatus((s) => ({ ...s, socket: "error" }));
        scheduleReconnect();
      });

      socket.on(
        `health-status-${serverName}`,
        ({ status: health, timestamp }) => {
          if (healthTimerRef.current) {
            clearTimeout(healthTimerRef.current);
            healthTimerRef.current = null;
          }
          setStatus((s) => ({
            ...s,
            health,
            ts: new Date(timestamp).toLocaleTimeString(),
          }));
        }
      );

      function scheduleReconnect() {
        // Evita programar múltiples timers
        if (retryTimerRef.current) return;
        const nextAttempt = attempt + 1;
        // Exponencial simple con tope
        const delay = Math.min(
          baseDelay * Math.pow(2, Math.min(nextAttempt, 6)),
          maxDelay
        );
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          connect(nextAttempt);
        }, delay);
      }
    };

    connect(0);

    return () => {
      unmountedRef.current = true;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (healthTimerRef.current) {
        clearTimeout(healthTimerRef.current);
        healthTimerRef.current = null;
      }
      if (watchdogRef.current) {
        clearInterval(watchdogRef.current);
        watchdogRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.close();
      }
    };
  }, [serverName]);

  const { socket, health, ts, attempt } = status;
  const isConnecting = socket !== "connected";
  const isUnknown = health === "unknown";
  const up = health === "up";
  const down = health === "down"; // explícito

  let dotColor;
  if (isConnecting) {
    dotColor = "bg-yellow-400 animate-pulse";
  } else if (isUnknown) {
    dotColor = "bg-gray-400 animate-pulse";
  } else if (up) {
    dotColor = "bg-green-500";
  } else if (down) {
    dotColor = "bg-red-500";
  } else {
    dotColor = "bg-gray-400";
  }

  let text;
  if (socket === "connecting") {
    text = `Conectando a ${alias || serverName}...`;
  } else if (socket === "reconnecting") {
    text = `Reconectando (${attempt}) a ${alias || serverName}...`;
  } else if (socket === "connected") {
    if (isUnknown) text = `Validando estado de ${alias || serverName}...`;
    else if (up) text = `${alias || serverName} [OK]`;
    else if (down) text = `${alias || serverName} [CAÍDO]`;
    else text = `${alias || serverName} [${health}]`;
  } else if (socket === "error") {
    text = `Error de socket. Reintentando...`;
  } else if (socket === "disconnected") {
    text = `${alias || serverName} [CAÍDO]`;
  } else {
    text = `Estado: ${socket}`;
  }

  return (
    <div
      className="flex flex-nowrap items-center text-xs space-x-1 whitespace-nowrap overflow-hidden"
      title={`Estado socket: ${socket} | Salud: ${health}`}
    >
      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${dotColor}`}></span>
      <span className="truncate">{text}</span>
      {ts && !isConnecting && !isUnknown && (
        <span className="flex-shrink-0">({ts})</span>
      )}
    </div>
  );
};
