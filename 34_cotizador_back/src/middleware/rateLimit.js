import rateLimit from "express-rate-limit";
import { handleResponse } from "#helpers/handlerResponse.js";
import { logger } from "#libs/logger.js";
import { identifyUser } from "./authMiddleware";

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000); // 15 minutes
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX ?? 300); // 300 req per window per IP
const AUTH_MAX = Number(process.env.RATE_LIMIT_AUTH_MAX ?? 20); // 20 auth attempts per window

const commonOptions = {
  windowMs: WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "testing",
  handler: async (req, res /*, next*/) => {
    const retryAfterSec =
      Math.ceil(
        (req.rateLimit.resetTime?.getTime?.() ?? Date.now()) - Date.now(),
      ) / 1000;
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);

      if (minutes > 0 && remainingSeconds > 0) {
        return `${minutes}min ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}min`;
      } else {
        return `${Math.max(1, remainingSeconds)}s`;
      }
    };

    const user = await identifyUser(req);

    logger.warn("Usuario bloqueado por exceso de solicitudes", {
      url: req.originalUrl,
      method: req.method,
      user: {
        ...user,
      },
      rateLimit: {
        limit: req.rateLimit.limit,
        remaining: req.rateLimit.remaining,
        resetTime: req.rateLimit.resetTime,
        retryAfterSec,
        retryAfterRelativeTime: formatTime(retryAfterSec),
      },
    });

    return res
      .status(429)
      .json(
        handleResponse(
          null,
          `Demasiadas solicitudes. Intenta de nuevo en ${formatTime(retryAfterSec)}`,
          false,
          429,
        ),
      );
  },
};

// Global/base limiter
export const baseLimiter = rateLimit({
  ...commonOptions,
  max: MAX_REQUESTS,
});

// Stricter limiter for auth-sensitive endpoints
export const authLimiter = rateLimit({
  ...commonOptions,
  max: AUTH_MAX,
});

export default { baseLimiter, authLimiter };
