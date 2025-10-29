import SocietyController from "#controllers/societyController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, SocietyController.getAll);

export default router;
