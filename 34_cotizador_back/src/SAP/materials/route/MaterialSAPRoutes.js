import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import { MaterialSAPController } from "../controllers/MaterialSAPController.js";

const router = express.Router();

router.get("/", authMiddleware, MaterialSAPController.getStock);

export default router;
