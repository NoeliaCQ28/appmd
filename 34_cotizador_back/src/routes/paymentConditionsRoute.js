import PaymentConditionsController from "#controllers/PaymentConditionsController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, PaymentConditionsController.getAll);

export default router;
