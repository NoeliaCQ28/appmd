import CellController from "#controllers/cellController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/parametros", authMiddleware, CellController.getParams);
router.post("/buscar", authMiddleware, CellController.getCells);
router.get("/", authMiddleware, CellController.getAllCells);

router.post("/create", authMiddleware, CellController.create);
router.put("/update/:id", authMiddleware, CellController.update);
router.patch("/delete/:id", authMiddleware, CellController.delete);

router.get("/accesorios", authMiddleware, CellController.getAllAccessorios);
router.post("/accesorios", authMiddleware, CellController.createAccesorio);
router.put("/accesorios/:id", authMiddleware, CellController.updateAccesorio);
router.delete("/accesorios/:id", authMiddleware, CellController.deleteAccesorio);

export default router;
