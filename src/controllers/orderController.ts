import { Request, Response } from "express";
import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import mongoose from "mongoose";

// Create new order from user's cart
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { shippingAddress } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty or does not exist" });
      return;
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.product.price, // Fix price at order time
    }));

    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      totalAmount: cart.total,
      shippingAddress: req.body.shippingAddress,
    });

    await order.save();

    // Clear cart after order creation
    await Cart.deleteOne({ user: userId });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const orders = await Order.find({ user: userId }).populate("items.product");
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get order by ID (single order details)
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }

    const order = await Order.findOne({ _id: orderId, user: userId }).populate(
      "items.product"
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// Admin-only: update order status
export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status provided." });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found." });
      return;
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};
