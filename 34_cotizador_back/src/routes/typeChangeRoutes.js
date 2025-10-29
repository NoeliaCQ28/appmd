import typeChangeController from "#controllers/typeChangeController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/tipo-cambio", typeChangeController.getTypeChange);

export default router;