import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load backend/.env
const envPath = path.resolve(__dirname, "../.env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Failed to load .env:", result.error.message);
}

const hasRazorpayCredentials =
  Boolean(process.env.RAZORPAY_KEY_ID) &&
  Boolean(process.env.RAZORPAY_KEY_SECRET);

const razorpay = hasRazorpayCredentials
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;



// import Razorpay from "razorpay";
// import crypto from "crypto";
// import mongoose from "mongoose";
// import Order from "../models/orderModel.js";
// import Product from "../models/productModel.js";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// console.log(
//   "Razorpay Key Loaded:",
//   Boolean(process.env.RAZORPAY_KEY_ID)
// );

// Create Razorpay order
export const createPaymentOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Online payment is not configured",
      });
    }

    const { items, address } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (
      !address?.name ||
      !address?.phone ||
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete address is required",
      });
    }

    // Merge duplicate products
    const productMap = new Map();

    for (const item of items) {
      const { productId, quantity } = item;

      if (
        !mongoose.isValidObjectId(productId) ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cart item",
        });
      }

      productMap.set(
        productId,
        (productMap.get(productId) || 0) + quantity
      );
    }

    const products = await Product.find({
      _id: { $in: [...productMap.keys()] },
    });

    if (products.length !== productMap.size) {
      return res.status(400).json({
        success: false,
        message: "Some products are unavailable",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const product of products) {
      const quantity = productMap.get(product._id.toString());

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      subtotal += product.price * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    const deliveryCharge = subtotal >= 999 ? 0 : 50;
    const total = subtotal + deliveryCharge;
    const amount = Math.round(total * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save pending order in MongoDB
    const dbOrder = await Order.create({
      userId: req.userId,
      items: orderItems,
      address,
      paymentMethod: "online",
      paymentStatus: "pending",
      orderStatus: "placed",
      subtotal,
      deliveryCharge,
      total,
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created",
      order: razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: dbOrder._id,
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Online payment is not configured",
      });
    }

    const {
      dbOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !mongoose.isValidObjectId(dbOrderId) ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature || "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment details",
      });
    }

    const order = await Order.findOne({
      _id: dbOrderId,
      userId: req.userId,
      paymentMethod: "online",
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Handle repeated verification
    if (order.paymentStatus === "paid") {
      if (order.razorpayPaymentId === razorpay_payment_id) {
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          order,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Confirm payment with Razorpay
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      payment.order_id !== razorpay_order_id ||
      payment.amount !== Math.round(order.total * 100) ||
      payment.currency !== "INR" ||
      payment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or details do not match",
      });
    }

    // Update stock and order atomically
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const currentOrder = await Order.findOne({
          _id: dbOrderId,
          userId: req.userId,
          paymentStatus: "pending",
        }).session(session);

        if (!currentOrder) {
          throw new Error("Order is no longer pending");
        }

        for (const item of currentOrder.items) {
          const product = await Product.findOneAndUpdate(
            {
              _id: item.productId,
              stock: { $gte: item.quantity },
            },
            {
              $inc: { stock: -item.quantity },
            },
            {
              new: true,
              session,
            }
          );

          if (!product) {
            throw new Error(
              `Insufficient stock for ${item.name}`
            );
          }
        }

        currentOrder.paymentStatus = "paid";
        currentOrder.razorpayPaymentId = razorpay_payment_id;
        currentOrder.orderStatus = "confirmed";

        await currentOrder.save({ session });
      });
    } finally {
      await session.endSession();
    }

    const updatedOrder = await Order.findById(dbOrderId);

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed",
    });
  }
};
