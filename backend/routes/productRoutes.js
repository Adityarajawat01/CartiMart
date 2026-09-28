import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = Router();

router.get("/products", getAllProducts);
router.post("/product", createProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

export default router;