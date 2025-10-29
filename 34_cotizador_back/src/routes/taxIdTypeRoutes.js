import TaxIdTypeController from "#controllers/TaxIdTypeController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, TaxIdTypeController.getAll);

export default router;
