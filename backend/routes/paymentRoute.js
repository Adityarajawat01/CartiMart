import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-order",
  authMiddleware,
  createPaymentOrder
);

paymentRouter.post(
  "/verify",
  authMiddleware,
  verifyPayment
);

export default paymentRouter;