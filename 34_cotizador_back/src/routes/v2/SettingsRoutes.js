import express from "express";
import SettingsController from "#controllers/v2/SettingsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/preferences", authMiddleware, SettingsController.getPreferences);
router.post(
  "/preferences",
  authMiddleware,
  SettingsController.createPreference,
);
router.put(
  "/preferences/:key",
  authMiddleware,
  SettingsController.updatePreference,
);
router.delete(
  "/preferences/:key",
  authMiddleware,
  SettingsController.deletePreference,
);

export default router;
