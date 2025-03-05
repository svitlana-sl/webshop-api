import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cartController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API for managing the shopping cart
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
 *         description: Unauthorized, only logged-in users can access this
 */
router.get("/", isAuthenticated, getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "660d6e7b88a3f2a1f0a56e5d"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Invalid input
 */
router.post("/", isAuthenticated, addToCart);

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "660d6e7b88a3f2a1f0a56e5d"
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       400:
 *         description: Invalid product ID
 */
router.delete("/:productId", isAuthenticated, removeFromCart);

export default router;
