import express from "express";
import OpcionalesController from "../controllers/opcionalesController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, OpcionalesController.getAll);
router.get("/search-by-integradora/:integradoraId", authMiddleware, OpcionalesController.getByIntegradoraId);
router.get("/id/:id", authMiddleware, OpcionalesController.getById);
router.post("/", authMiddleware, OpcionalesController.create);
router.put("/:id", authMiddleware, OpcionalesController.update);
router.delete("/:id", authMiddleware, OpcionalesController.delete);

router.get("/brands", authMiddleware, OpcionalesController.getAllBrands);
router.get("/types", authMiddleware, OpcionalesController.getAllTypes);

export default router;
