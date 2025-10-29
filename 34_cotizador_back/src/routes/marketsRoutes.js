import MarketController from "#controllers/marketController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, MarketController.getAll);

export default router;
