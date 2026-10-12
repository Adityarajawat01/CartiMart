import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, address, paymentMethod } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (paymentMethod !== "cod") {
      return res.status(400).json({
        message: "Use Razorpay for online payments",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { name, phone, street, city, state, pincode } = address || {};

    if (
      !name?.trim() ||
      !/^[0-9]{10}$/.test(phone || "") ||
      !street?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !/^[0-9]{6}$/.test(pincode || "")
    ) {
      return res.status(400).json({
        message: "Please provide a valid delivery address",
      });
    }

    const quantities = new Map();

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid cart item",
        });
      }

      const id = item.productId.toString();
      quantities.set(id, (quantities.get(id) || 0) + item.quantity);
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let subtotal = 0;

      for (const [productId, quantity] of quantities) {
           const product = await Product.findById(productId).session(session);

        if (!product) {
          const error = new Error("A product no longer exists");
          error.status = 404;
          throw error;
        }

        if (product.stock < quantity) {
          const error = new Error(`Insufficient stock for ${product.name}`);
          error.status = 409;
          throw error;
        }

        const updated = await Product.updateOne(
          { _id: product._id, stock: { $gte: quantity } },
          { $inc: { stock: -quantity } },
          { session },
        );

        if (updated.modifiedCount !== 1) {
          const error = new Error(`Insufficient stock for ${product.name}`);
          error.status = 409;
          throw error;
        }

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image || product.images?.[0] || "",
        });

        subtotal += product.price * quantity;
      }

      const deliveryCharge = subtotal >= 999 ? 0 : 49;
      const total = subtotal + deliveryCharge;

      const [order] = await Order.create(
        [
          {
            userId,
            items: orderItems,
            address: {
              name: name.trim(),
              phone,
              street: street.trim(),
              city: city.trim(),
              state: state.trim(),
              pincode,
            },
            paymentMethod: "cod",
            paymentStatus: "pending",
            orderStatus: "placed",
            subtotal,
            deliveryCharge,
            total,
          },
        ],
        { session },
      );

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("COD order error:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  } finally {
    await session.endSession();
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
