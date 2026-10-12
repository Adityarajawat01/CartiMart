import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [totalProducts, lowStockProducts, totalOrders, revenue, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ stock: { $lte: 5 } }),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("userId", "name email")
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        lowStockProducts,
        totalOrders,
        paidRevenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load the admin dashboard.",
    });
  }
};

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("userId", "name email")
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get admin orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load orders.",
    });
  }
};

const allowedTransitions = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const updateAdminOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!Object.hasOwn(allowedTransitions, status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status.",
    });
  }

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  const session = await mongoose.startSession();

  try {
    let updatedOrder;
    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(session);

      if (!order) {
        const error = new Error("Order not found.");
        error.status = 404;
        throw error;
      }

      if (!allowedTransitions[order.orderStatus].includes(status)) {
        const error = new Error(
          `Order cannot move from ${order.orderStatus} to ${status}.`,
        );
        error.status = 409;
        throw error;
      }

      if (status === "cancelled" && order.paymentStatus === "paid") {
        const error = new Error(
          "Paid online orders cannot be cancelled because refunds are not configured.",
        );
        error.status = 409;
        throw error;
      }

      if (status === "cancelled" && order.paymentMethod === "cod") {
        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: item.quantity } },
            { session },
          );
        }
      }

      order.orderStatus = status;
      if (status === "delivered" && order.paymentMethod === "cod") {
        order.paymentStatus = "paid";
      }
      await order.save({ session });
      updatedOrder = order;
    });

    return res.status(200).json({
      success: true,
      message: "Order status updated.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update admin order status error:", error);
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Unable to update order status.",
    });
  } finally {
    await session.endSession();
  }
};
