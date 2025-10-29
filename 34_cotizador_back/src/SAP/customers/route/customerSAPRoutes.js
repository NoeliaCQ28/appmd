import express from "express";
import { authMiddleware } from "../../../middleware/authMiddleware.js";
import { CustomerSAPController } from "../controllers/customerSAPController.js";

const router = express.Router();

router.get("/", authMiddleware, CustomerSAPController.find);
router.post(
  "/create-from-model/:customerId",
  authMiddleware,
  CustomerSAPController.createFromModel
);

export default router;
