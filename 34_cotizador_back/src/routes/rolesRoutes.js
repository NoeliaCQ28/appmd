import RolesController from "#controllers/rolesController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, RolesController.getAll);

export default router;
