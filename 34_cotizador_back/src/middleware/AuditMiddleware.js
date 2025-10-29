import AuthHelper from "#helpers/AuthHelper.js";

export const AuditMiddleware = async (req, res, next) => {
  try {
    // Injectar contexto

    req.ctx = await AuthHelper.getContext(req);

    next();
  } catch (error) {
    res.status(500).json({
      error: `Error interno del servidor en el middleware de auditoría ${error?.message}`,
    });
  }
};
