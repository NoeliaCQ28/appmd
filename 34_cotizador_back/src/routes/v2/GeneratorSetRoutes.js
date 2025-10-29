import express from "express";
import GeneratorSetController from "#controllers/v2/GeneratorSetController.js";
import MarginController from "#controllers/v2/MarginController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/itms", authMiddleware, GeneratorSetController.getAllITMs);

router.get(
  "/itms/by-combination/:integradoraId",
  authMiddleware,
  GeneratorSetController.getAllITMsByCombination,
);

router.get("/itms/:id", authMiddleware, GeneratorSetController.getITMById);

router.get(
  "/alternators",
  authMiddleware,
  GeneratorSetController.getAllAlternators,
);

router.get(
  "/alternators/by-combination/:integradoraId",
  authMiddleware,
  GeneratorSetController.getAllAlternatorsByCombination,
);

router.get(
  "/alternators/:id",
  authMiddleware,
  GeneratorSetController.getAlternatorById,
);

router.get("/margins", authMiddleware, MarginController.find);

router.post(
  "/get-all-combinations",
  authMiddleware,
  GeneratorSetController.getAllCombinations,
);
router.post(
  "/combinations-by-integradora",
  authMiddleware,
  GeneratorSetController.getCombinationByIntegradora,
);
router.post(
  "/change-configuration",
  authMiddleware,
  GeneratorSetController.changeConfiguration,
);

export default router;
