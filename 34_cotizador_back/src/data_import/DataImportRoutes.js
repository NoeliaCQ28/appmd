import express from "express";
import multer from "multer";
import DataImportController from "./DataImportController";

const upload = multer();

const router = express.Router();

router.post("/import", upload.single("file"), DataImportController.import);

export default router;
