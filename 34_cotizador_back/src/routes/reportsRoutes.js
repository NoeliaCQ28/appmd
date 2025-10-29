import express from "express";
import ReportsController from "#controllers/reportsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/by-executive",
  authMiddleware,
  ReportsController.getExecutiveReport,
);
router.get(
  "/by-executive/export",
  authMiddleware,
  ReportsController.exportExecutiveReportToExcel,
);

router.get(
  "/by-quotes",
  authMiddleware,
  ReportsController.getQuoteReport,
);
router.get(
  "/by-quotes/export",
  authMiddleware,
  ReportsController.exportQuoteReportToExcel,
);

router.get(
  "/by-customers",
  authMiddleware,
  ReportsController.getCustomerReport,
);

router.get(
  "/by-customers/export",
  authMiddleware,
  ReportsController.exportCustomerReportToExcel,
);
router.get("/card-resume", authMiddleware, ReportsController.getCardResume);

export default router;
