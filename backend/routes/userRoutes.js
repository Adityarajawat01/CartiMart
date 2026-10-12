import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
import {
  signup,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
} from "../controllers/userController.js";
import {
  getShoppingData,
  saveShoppingData,
} from "../controllers/shoppingDataController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/profile/image", authMiddleware, upload.single("image"), updateProfileImage);
router.get("/shopping-data", authMiddleware, getShoppingData);
router.put("/shopping-data", authMiddleware, saveShoppingData);

export default router;
