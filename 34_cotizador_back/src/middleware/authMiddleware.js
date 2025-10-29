import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }
  const [, token] = bearer.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      const error = new Error("Token no válido");
      return res.status(401).json({ error: error.message });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: `Token no válido ${error?.message}` });
  }
};
