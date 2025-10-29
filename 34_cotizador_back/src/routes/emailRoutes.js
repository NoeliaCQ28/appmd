import express from "express";
import EmailController from "#controllers/EmailController.js";

const router = express.Router();

router.post(
  "/send-email-for-get-a-quote",
  EmailController.sendEmailForGetAQuote,
);

export default router;
