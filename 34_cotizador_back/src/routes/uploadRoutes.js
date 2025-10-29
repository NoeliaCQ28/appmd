// uploadRoutes.js
import UploadController from "#controllers/uploadController.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer(); // Configuración básica; puedes personalizarla según tus necesidades

router.post("/", upload.single("file"), UploadController.uploadFile);
router.post("/find", UploadController.getFileUrl);
router.post("/buffer", UploadController.getBuffer);
router.delete("/", UploadController.deleteFile);

export default router;
