import TaxClassController from "#controllers/TaxClassController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, TaxClassController.getAll);

export default router;
