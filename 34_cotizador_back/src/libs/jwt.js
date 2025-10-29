import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  const expiresIn = process.env.JWT_EXPIRE || "7d";
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
