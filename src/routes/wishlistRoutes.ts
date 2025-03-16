import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API for managing user's wishlist
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's wishlist with product IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: "67c60eeedbaacaf65d92cdf3"
 *                 products:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["67d707cb7c35f3e8dfe93641", "67d708af7c35f3e8dfe93652"]
 *       401:
 *         description: Unauthorized
 */
router.get("/", isAuthenticated, getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a product to wishlist
 *     tags: [Wishlist]
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
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "67d707cb7c35f3e8dfe93641"
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added to wishlist"
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", isAuthenticated, addToWishlist);

/**
 * @swagger
 * /api/wishlist/clear:
 *   delete:
 *     summary: Clear all products from user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wishlist cleared successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wishlist not found
 */
router.delete("/clear", isAuthenticated, clearWishlist);

/**
 * @swagger
 * /api/wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         example: "67d707cb7c35f3e8dfe93641"
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product removed from wishlist"
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 */
router.delete("/:productId", isAuthenticated, removeFromWishlist);

export default router;
