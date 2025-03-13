import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing user orders
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shippingAddress
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "Main Street 1"
 *                   city:
 *                     type: string
 *                     example: "Kyiv"
 *                   postalCode:
 *                     type: string
 *                     example: "01001"
 *                   country:
 *                     type: string
 *                     example: "Ukraine"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", isAuthenticated, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's orders
 *       401:
 *         description: Unauthorized
 */
router.get("/", isAuthenticated, getUserOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get specific order details by order ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "67cdf80e9b23fa88664dca88"
 *     responses:
 *       200:
 *         description: Successfully retrieved order details
 *       400:
 *         description: Invalid order ID
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:orderId", isAuthenticated, getOrderById);

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "67cdf80e9b23fa88664dca99"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid input or order ID
 *       403:
 *         description: Forbidden, requires admin role
 *       401:
 *         description: Unauthorized
 */
router.put("/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
