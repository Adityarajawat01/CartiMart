import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";
import {
  MAX_CART_ITEMS,
  MAX_WISHLIST_ITEMS,
  normalizeShoppingData,
} from "../utils/shoppingData.js";

const productA = new mongoose.Types.ObjectId().toString();
const productB = new mongoose.Types.ObjectId().toString();

test("normalizes valid cart quantities and wishlist product ids", () => {
  assert.deepEqual(
    normalizeShoppingData({
      cart: [{ productId: productA.toUpperCase(), quantity: "2" }],
      wishlist: [productB],
    }),
    {
      cartItems: [{ product: productA, quantity: 2 }],
      wishlistItems: [productB],
    },
  );
});

test("rejects case-insensitive duplicate product ids", () => {
  assert.match(
    normalizeShoppingData({
      cart: [
        { productId: productA, quantity: 1 },
        { productId: productA.toUpperCase(), quantity: 2 },
      ],
      wishlist: [],
    }).error,
    /invalid product or quantity/,
  );

  assert.match(
    normalizeShoppingData({
      cart: [],
      wishlist: [productA, productA.toUpperCase()],
    }).error,
    /invalid or duplicate product/,
  );
});

test("rejects invalid quantities and duplicate products", () => {
  for (const quantity of [0, 1.5, 100, true, "", "1e2"]) {
    assert.match(
      normalizeShoppingData({
        cart: [{ productId: productA, quantity }],
        wishlist: [],
      }).error,
      /invalid product or quantity/,
    );
  }

  assert.match(
    normalizeShoppingData({
      cart: [
        { productId: productA, quantity: 1 },
        { productId: productA, quantity: 2 },
      ],
      wishlist: [],
    }).error,
    /invalid product or quantity/,
  );
});

test("rejects malformed payloads, invalid ids, duplicates, and oversized lists", () => {
  assert.match(normalizeShoppingData({}).error, /must both be arrays/);
  assert.match(
    normalizeShoppingData({ cart: [], wishlist: ["invalid-id"] }).error,
    /invalid or duplicate product/,
  );
  assert.match(
    normalizeShoppingData({ cart: [], wishlist: ["abcdefghijkl"] }).error,
    /invalid or duplicate product/,
  );
  assert.match(
    normalizeShoppingData({
      cart: [],
      wishlist: [productA, productA],
    }).error,
    /invalid or duplicate product/,
  );
  assert.match(
    normalizeShoppingData({
      cart: Array.from({ length: MAX_CART_ITEMS + 1 }, () => ({
        productId: new mongoose.Types.ObjectId().toString(),
        quantity: 1,
      })),
      wishlist: [],
    }).error,
    /reached its item limit/,
  );
  assert.match(
    normalizeShoppingData({
      cart: [],
      wishlist: Array.from({ length: MAX_WISHLIST_ITEMS + 1 }, () =>
        new mongoose.Types.ObjectId().toString(),
      ),
    }).error,
    /reached its item limit/,
  );
});
