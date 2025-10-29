import TransformerController from "#controllers/transformerController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/parametros", authMiddleware, TransformerController.getParams);
router.post("/buscar", authMiddleware, TransformerController.getTransformers);
router.get("/", authMiddleware, TransformerController.getAllTransformers);
router.get(
  "/accesorios",
  authMiddleware,
  TransformerController.getAllAccesorios
);
router.post(
  "/accesorios",
  authMiddleware,
  TransformerController.createAccesorio
);
router.put(
  "/accesorios/:id",
  authMiddleware,
  TransformerController.updateAccesorio
);
router.delete(
  "/accesorios/:id",
  authMiddleware,
  TransformerController.deleteAccesorio
);

router.post("/create", authMiddleware, TransformerController.create);
router.put("/update/:id", authMiddleware, TransformerController.update);
router.patch("/delete/:id", authMiddleware, TransformerController.delete);

export default router;
