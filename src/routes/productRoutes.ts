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
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Returns a list of all products
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
 *         example: 660d6e7b88a3f2a1f0a56e5d
 *     responses:
 *       200:
 *         description: Returns the product with the specified ID
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Men's Classic Blue Jeans"
 *               description:
 *                 type: string
 *                 example: "Stylish and comfortable classic fit jeans for men, made from high-quality denim."
 *               category:
 *                 type: string
 *                 example: "660d6e7b88a3f2a1f0a56e5d"
 *               price:
 *                 type: number
 *                 example: 59.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/images/mens-jeans-front.jpg"]
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     size:
 *                       type: string
 *                     color:
 *                       type: string
 *                 example: [{ "size": "M", "color": "Blue" }]
 *               ratings:
 *                 type: number
 *                 example: 4.5
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden, requires admin role
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 660d6e7b88a3f2a1f0a56e5d
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Forbidden, requires admin role
 *       404:
 *         description: Product not found
 */
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;
