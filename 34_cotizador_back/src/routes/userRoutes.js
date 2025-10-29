import UserController from "#controllers/userController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, UserController.getAll);

export default router;
