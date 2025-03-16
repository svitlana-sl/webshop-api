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
      productId: item.product._id,
      variantId: item.variantId,
      quantity: item.quantity,
      price: item.product.price,
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

    // send formatted response
    res.status(201).json({
      message: "Order created successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        items: orderItems,
      },
    });
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

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.product",
        select: "name images variants",
      })
      .lean();

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      items: order.items.map((item) => {
        const selectedVariant = item.product.variants.find(
          (variant) => variant._id.toString() === item.variantId.toString()
        );

        return {
          productId: item.product._id,
          name: item.product.name,
          image: item.product.images[0], // show only first image
          variant: selectedVariant
            ? { size: selectedVariant.size, color: selectedVariant.color }
            : null,
          quantity: item.quantity,
          price: item.price,
        };
      }),
    }));

    res.json(formattedOrders);
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
    const orderId = req.params.orderId;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400).json({ message: "Invalid order ID" });
      return;
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "items.product",
        select: "name images variants",
      })
      .lean();

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (order.user.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Access denied. You can only view your own orders." });
      return;
    }

    const formattedOrder = {
      _id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      items: order.items.map((item) => {
        const selectedVariant = item.product.variants.find(
          (variant) => variant._id.toString() === item.variantId.toString()
        );

        return {
          productId: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          variant: selectedVariant
            ? { size: selectedVariant.size, color: selectedVariant.color }
            : null,
          quantity: item.quantity,
          price: item.price,
        };
      }),
    };

    res.json(formattedOrder);
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

    res.json({
      message: "Order status updated successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};
