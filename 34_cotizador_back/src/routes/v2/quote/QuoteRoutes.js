import express from "express";
import QuoteController from "#controllers/v2/quote/QuoteController.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, QuoteController.create);
router.get("/:quoteId", authMiddleware, QuoteController.getById);
router.put(
  "/:quoteId/details/:quoteDetailId",
  authMiddleware,
  QuoteController.updateDetail,
);
router.post("/:quoteId/details", authMiddleware, QuoteController.addDetails);

export default router;
