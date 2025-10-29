import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";

const AuthHelper = {
  identifyUser: async (req) => {
    const ip =
      req?.ip ||
      req?.headers["x-forwarded-for"] ||
      req?.connection.remoteAddress ||
      "desconocida";

    try {
      const bearer = req.headers.authorization;

      if (!bearer) {
        return {
          name: "anónimo",
          ip,
        };
      }

      const [, token] = bearer.split(" ");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        ...decoded,
        ip,
      };
    } catch (_error) {
      return {
        name: "anónimo",
        ip,
      };
    }
  },

  getReadableUserAgent: (ua) => {
    if (!ua) return "Desconocido";

    const uaParsed = UAParser(ua);

    const uaMapped = {
      ...uaParsed,
      userAgentRaw: ua,
    };
    delete uaMapped.ua;
    return uaMapped;
  },

  getContext: async (req) => {
    const user = await AuthHelper.identifyUser(req);

    const uaRaw = req.headers["user-agent"];
    const ua = AuthHelper.getReadableUserAgent(uaRaw);

    return {
      user: user,
      ua,
      endpoint: req.originalUrl || req.url || "",
      method: req.method || "API",
    };
  },
};
export default AuthHelper;
