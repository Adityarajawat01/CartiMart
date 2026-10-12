import { Router } from "express";
import {
  getAdminDashboard,
  getAdminOrders,
  updateAdminOrderStatus,
} from "../controllers/adminController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.get("/dashboard", getAdminDashboard);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAdminOrders);
router.patch("/orders/:id/status", updateAdminOrderStatus);

export default router;
