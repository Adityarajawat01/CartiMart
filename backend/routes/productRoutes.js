import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = Router();

router.get("/products", getAllProducts);
router.post("/product", authMiddleware, adminMiddleware, createProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/product/:id", authMiddleware, adminMiddleware, deleteProduct);

export default router;