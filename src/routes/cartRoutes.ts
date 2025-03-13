import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing user's cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart with products and total price
 *       401:
 *         description: Unauthorized
 */
router.get("/", isAuthenticated, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - variantId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "67cdf80e9b23fa88664dca56"
 *               variantId:
 *                 type: string
 *                 example: "67cdf80e9b23fa88664dca57"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item successfully added to cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", isAuthenticated, addToCart);

/**
 * @swagger
 * /api/cart/{productId}/{variantId}:
 *   delete:
 *     summary: Remove specific variant of product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "67cdf80e9b23fa88664dca56"
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         example: "67cdf80e9b23fa88664dca57"
 *     responses:
 *       200:
 *         description: Product variant removed from cart successfully
 *       400:
 *         description: Invalid product ID or variant ID
 *       401:
 *         description: Unauthorized
 */
router.delete("/:productId/:variantId", isAuthenticated, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete("/clear", isAuthenticated, clearCart);

export default router;
