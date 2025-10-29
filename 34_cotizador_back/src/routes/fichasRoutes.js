import express from "express";
import TechnicalReportController from "../controllers/fichasTecnicasController.js";

const router = express.Router();

router.post("/modelos", TechnicalReportController.search);
router.get("/tecnicas/:id", TechnicalReportController.getByCombinationId);

export default router;
