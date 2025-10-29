import express from "express";
import {
  deleteVendedor,
  editVendedor,
  listVendedor,
  registerVendedor,
  syncERPVendedores,
} from "../controllers/vendedorController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authMiddleware, registerVendedor);
router.put("/edit/:id", authMiddleware, editVendedor);
router.patch("/delete/:id", authMiddleware, deleteVendedor);
router.get("/listar", authMiddleware, listVendedor);
router.get("/sincronizar", authMiddleware, syncERPVendedores);

export default router;
