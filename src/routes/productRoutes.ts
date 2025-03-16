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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Internal server error
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
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
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
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         subcategory:
 *           $ref: '#/components/schemas/Subcategory'
 *         price:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 *         ratings:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         price:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantInput'
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Subcategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Variant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         size:
 *           type: string
 *         color:
 *           type: string
 *     VariantInput:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *         color:
 *           type: string
 */
