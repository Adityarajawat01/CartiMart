import mongoose from "mongoose";

export const MAX_CART_ITEMS = 100;
export const MAX_WISHLIST_ITEMS = 500;

const normalizeProductId = (value) => {
  if (value == null) return null;

  const productId = String(value).trim().toLowerCase();
  return mongoose.isObjectIdOrHexString(productId) ? productId : null;
};

const normalizeQuantity = (value) => {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : null;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    const quantity = Number(value);
    return Number.isInteger(quantity) ? quantity : null;
  }

  return null;
};

export const normalizeShoppingData = (body) => {
  if (!Array.isArray(body?.cart) || !Array.isArray(body?.wishlist)) {
    return { error: "Cart and wishlist must both be arrays." };
  }

  if (
    body.cart.length > MAX_CART_ITEMS ||
    body.wishlist.length > MAX_WISHLIST_ITEMS
  ) {
    return { error: "Cart or wishlist has reached its item limit." };
  }

  const cartItems = [];
  const cartProductIds = new Set();

  for (const item of body.cart) {
    const productId = normalizeProductId(item?.productId);
    const quantity = normalizeQuantity(item?.quantity);

    if (
      !productId ||
      quantity < 1 ||
      quantity > 99 ||
      cartProductIds.has(productId)
    ) {
      return { error: "Cart contains an invalid product or quantity." };
    }

    cartProductIds.add(productId);
    cartItems.push({ product: productId, quantity });
  }

  const wishlistItems = [];
  const wishlistProductIds = new Set();

  for (const rawProductId of body.wishlist) {
    const productId = normalizeProductId(rawProductId);

    if (
      !productId ||
      wishlistProductIds.has(productId)
    ) {
      return { error: "Wishlist contains an invalid or duplicate product." };
    }

    wishlistProductIds.add(productId);
    wishlistItems.push(productId);
  }

  return { cartItems, wishlistItems };
};
