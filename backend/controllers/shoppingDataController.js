import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { normalizeShoppingData } from "../utils/shoppingData.js";

const serializeShoppingData = (user) => ({
  cart: user.cartItems
    .filter((item) => item.product)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
  wishlist: user.wishlistItems.filter(Boolean),
});

export const getShoppingData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("cartItems wishlistItems shoppingDataInitialized")
      .populate("cartItems.product")
      .populate("wishlistItems");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      ...serializeShoppingData(user),
      initialized: user.shoppingDataInitialized,
    });
  } catch (error) {
    console.error("Get shopping data error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your cart and wishlist.",
    });
  }
};

export const saveShoppingData = async (req, res) => {
  const normalized = normalizeShoppingData(req.body);
  if (normalized.error) {
    return res.status(400).json({
      success: false,
      message: normalized.error,
    });
  }

  try {
    const productIds = [
      ...normalized.cartItems.map((item) => item.product),
      ...normalized.wishlistItems,
    ];
    const products = await Product.find({ _id: { $in: productIds } })
      .select("_id")
      .lean();
    const existingProductIds = new Set(
      products.map((product) => String(product._id)),
    );

    if (productIds.some((productId) => !existingProductIds.has(String(productId)))) {
      return res.status(400).json({
        success: false,
        message: "One or more products are no longer available.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          cartItems: normalized.cartItems,
          wishlistItems: normalized.wishlistItems,
          shoppingDataInitialized: true,
        },
      },
      { new: true, runValidators: true },
    )
      .select("cartItems wishlistItems")
      .populate("cartItems.product")
      .populate("wishlistItems");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart and wishlist saved.",
      ...serializeShoppingData(user),
      initialized: true,
    });
  } catch (error) {
    console.error("Save shopping data error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to save your cart and wishlist.",
    });
  }
};
