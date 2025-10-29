import GeneratorSetController from "#controllers/generatorSetController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, GeneratorSetController.create);
router.get("/parametros", GeneratorSetController.getParams);
router.post(
  "/modelos",
  GeneratorSetController.getModelsByParams
);
router.get(
  "/modelos/search",
  GeneratorSetController.searchModels
);

router.get(
  "/search-params/models",
  GeneratorSetController.getModels
);
router.get(
  "/search-params/motor-brands",
  GeneratorSetController.getMotorBrands
);
router.get(
  "/search-params/motor-models",
  GeneratorSetController.getMotorModels
);
router.get(
  "/search-params/alternator-brands",
  GeneratorSetController.getAlternatorBrands
);
router.get(
  "/search-params/alternator-models",
  GeneratorSetController.getAlternatorModels
);
router.get(
  "/search-params/voltages",
  GeneratorSetController.getVoltages
);
router.get(
  "/search-params/frequencies",
  GeneratorSetController.getFrequencies
);
router.get(
  "/search-params/phases",
  GeneratorSetController.getPhases
);
router.get(
  "/search-params/power-factors",
  GeneratorSetController.getPowerFactors
);
router.get(
  "/search-params/altitudes",
  GeneratorSetController.getAltitudes
);
router.get(
  "/search-params/itms",
  GeneratorSetController.getITMs
);
router.get(
  "/search-params/markets",
  GeneratorSetController.getMarkets
);

router.get(
  "/info/motor/:motor_modelo",
  authMiddleware,
  GeneratorSetController.getMotorInfo
);
router.get(
  "/info/alternator/:alternador_modelo",
  authMiddleware,
  GeneratorSetController.getAlternatorInfo
);
router.get(
  "/info/modelo/:modelo",
  authMiddleware,
  GeneratorSetController.getModeloInfo
);
router.get(
  "/info/prices",
  authMiddleware,
  GeneratorSetController.getModelPrices
);

router.post(
  "/update/motor-models",
  authMiddleware,
  GeneratorSetController.updateMotorInformation
);
router.post(
  "/update/power-motor",
  authMiddleware,
  GeneratorSetController.updatePowerMotorInformation
);
router.post(
  "/update/power-alternator",
  authMiddleware,
  GeneratorSetController.updatePowerAlternatorInformation
);
router.post(
  "/update/modelos-models",
  authMiddleware,
  GeneratorSetController.updateModeloInformation
);
router.post(
  "/update/alternador-models",
  authMiddleware,
  GeneratorSetController.updateAlternadorInformation
);
router.post(
  "/update/modelos-prices",
  authMiddleware,
  GeneratorSetController.updateModelPricesInformation
);

// Endpoint para actualizar solo imágenes
router.post(
  "/update/images",
  authMiddleware,
  GeneratorSetController.updateModelImages
);

router.post(
  "/create/power-motor",
  authMiddleware,
  GeneratorSetController.createPowerMotorInformation
);
router.post(
  "/create/power-alternator",
  authMiddleware,
  GeneratorSetController.createPowerAlternatorInformation
);

router.post(
  "/create/motor-info",
  authMiddleware,
  GeneratorSetController.createMotorInformation
);
router.post(
  "/create/alternador-info",
  authMiddleware,
  GeneratorSetController.createAlternadorInformation
);

router.post(
  "/integradora",
  authMiddleware,
  GeneratorSetController.createIntegradora
);

router.put(
  "/integradora/:id",
  authMiddleware,
  GeneratorSetController.updateIntegradora
);

router.put(
  "/delete/:modelo",
  authMiddleware,
  GeneratorSetController.deleteModelAndIntegradora
);

export default router;
