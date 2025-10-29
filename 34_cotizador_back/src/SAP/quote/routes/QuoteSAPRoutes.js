import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import { QuoteValidateSAPController } from "../controller/QuoteValidateSAPController.js";

const router = express.Router();

router.post("/validate", authMiddleware, QuoteValidateSAPController.validate);

export default router;
