import express from "express";
import CurrencyController from "../controllers/currencyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, CurrencyController.getAll);


export default router;
