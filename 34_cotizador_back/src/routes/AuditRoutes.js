import express from "express";
import AuditModel from "#models/AuditModel.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/activity", authMiddleware, async (req, res) => {
  const { startDate, endDate, limit } = req.query;
  
  // Si no se proporcionan fechas, usar últimos 7 días por defecto
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  // Formato DATETIME para MySQL (YYYY-MM-DD HH:MM:SS)
  const finalStartDate = startDate 
    ? `${startDate} 00:00:00` 
    : oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ');
  
  const finalEndDate = endDate 
    ? `${endDate} 23:59:59` 
    : now.toISOString().slice(0, 19).replace('T', ' ');
  
  const response = await AuditModel.getActivity({
    startDate: finalStartDate,
    endDate: finalEndDate,
    limit: limit ? parseInt(limit) : 100
  });
  
  res.status(response.code).send(response);
});

export default router;
