
import express from "express";
import { createOrder, getMyOrders } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/", authMiddleware, createOrder);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);

export default orderRouter;

