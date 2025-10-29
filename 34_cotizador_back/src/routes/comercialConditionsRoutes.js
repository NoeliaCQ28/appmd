import express from "express";
import ComercialConditionsController from "../controllers/comercialConditionsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, ComercialConditionsController.getAll);
router.post("/", authMiddleware, ComercialConditionsController.create);
router.put("/:id", authMiddleware, ComercialConditionsController.update);
router.delete("/:id", authMiddleware, ComercialConditionsController.delete);

export default router;
