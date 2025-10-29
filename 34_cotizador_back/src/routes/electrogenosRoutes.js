import express from "express";
import {
  obtenerAlternadores,
  obtenerDerrateo,
  obtenerItm,
  obtenerModelos,
  obtenerMotores,
  obtenerPrecios,
  parametrosElectrogenos,
} from "../controllers/gruposElectrogenosController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/parametros", parametrosElectrogenos);
router.post("/modelos", authMiddleware, obtenerModelos);
router.post("/motores", authMiddleware, obtenerMotores);
router.post("/alternadores", authMiddleware, obtenerAlternadores);
router.post("/derrateo", authMiddleware, obtenerDerrateo);
router.post("/precios", authMiddleware, obtenerPrecios);
router.post("/itm", authMiddleware, obtenerItm);

export default router;
