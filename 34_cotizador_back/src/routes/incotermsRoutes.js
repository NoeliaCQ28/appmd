import IncotermsController from "#controllers/incotermsController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/", authMiddleware, IncotermsController.getAll);

export default router;
