import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from "../controllers/productController";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filters
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *         description: Filter products by subcategory
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *         description: Filter products by size
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Filter products by color
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", isAuthenticated, isAdmin, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
