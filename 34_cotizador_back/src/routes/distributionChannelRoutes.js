import DistributionChannelController from "#controllers/distributionChannelController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, DistributionChannelController.getAll);

export default router;
