import CustomerBranchController from "#controllers/customerBranchController.js";
import express from "express";
import CustomerController from "../controllers/customerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, CustomerController.getAll);
router.get("/ramos", authMiddleware, CustomerBranchController.getAll);
router.get("/ERP/:ruc", authMiddleware, CustomerController.getFromERPByRuc);

router.get(
  "/:id/contacts",
  authMiddleware,
  CustomerController.getContactsByCustomerId
);
router.post("/:id/contacts", authMiddleware, CustomerController.createContact);
router.put(
  "/:id/contacts/:contact_id",
  authMiddleware,
  CustomerController.updateContact
);
router.delete(
  "/:id/contacts/:contact_id",
  authMiddleware,
  CustomerController.deleteContact
);
router.post("/", authMiddleware, CustomerController.create);
router.put("/edit/:id", authMiddleware, CustomerController.update);
router.delete("/delete/:id", authMiddleware, CustomerController.delete);

router.get("/contacts/denominations", authMiddleware, CustomerController.getContactsDenomination);

router.get("/contacts/deparments", authMiddleware, CustomerController.getContactsDeparments);

export default router;
