import path from "node:path";
import winston, { format } from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const callerFormat = format((info) => {
  // 1. Obtenemos el stack y quitamos la primera línea ("Error")
  const stackLines = new Error().stack.split("\n").slice(1);

  // 2. Excluir patrones: node_modules y este mismo fichero
  const excludePatterns = ["node_modules", path.basename(__filename)];

  // 3. Regex para extraer ruta y línea (con o sin paréntesis)
  const regex = /\s+at\s+(?:.*\s)?\(?(.+):(\d+):\d+\)?$/;

  // 4. Buscamos el primer frame válido
  let location = "unknown";
  for (const line of stackLines) {
    if (excludePatterns.some((pat) => line.includes(pat))) continue;
    const m = line.match(regex);
    if (m) {
      const fullPath = m[1];
      const lineNumber = m[2];
      // Normalizar separadores a "/" y relativizar
      const relPath = path
        .relative(process.cwd(), fullPath)
        .replace(/\\/g, "/");
      location = `${relPath}:${lineNumber}`;
      break;
    }
  }

  info.location = location;
  return info;
});

const safeStringify = (obj) => {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (_, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]";
        seen.add(value);
      }
      return value;
    },
    2,
  );
};

const customFormat = printf(
  ({ level, message, timestamp, stack, location, ...meta }) => {
    let emoji = "";

    const enabledLocation = level.toLowerCase() !== "network";

    switch (level.toLowerCase()) {
      case "error":
        emoji = "❌ ";
        break;
      case "warn":
        emoji = "⚠️ ";
        break;
      case "info":
        emoji = "ℹ️ ";
        break;
      case "verbose":
        emoji = "📝 ";
        break;
      case "network":
        emoji = "🌐";
        break;
      default:
        emoji = "📌 ";
    }

    const paddedLevel = level.toUpperCase();

    // Serializa meta si existe de forma segura (evita referencias circulares)
    const metaString = Object.keys(meta).length
      ? ` ${safeStringify(meta)}`
      : "";

    return `${timestamp} | ${emoji} ${paddedLevel} | ${enabledLocation ? location : ""} ${
      stack || message
    } ${metaString}`;
  },
);

const NODE_ENV = process.env.NODE_ENV;

const isDebug = NODE_ENV === "local" || NODE_ENV === "development";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    network: 3,
    verbose: 4,
    debug: 5,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "blue",
    network: "green",
    verbose: "grey",   // 👈 usa "grey" en vez de "gray"
    debug: "magenta",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: isDebug ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    callerFormat(),
    customFormat,
    colorize({ all: true }),
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined-network.log', level: "network" }),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export { logger };
