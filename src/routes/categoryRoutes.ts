import express from "express";
import {
  getCategories,
  createCategory,
  deleteCategory,
  getSubcategories,
  createSubcategory,
  deleteSubcategory,
} from "../controllers/categoryController";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for managing product categories
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Returns a list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/", getCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Men's Fashion"
 *               description:
 *                 type: string
 *                 example: "Clothing and accessories for men"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
router.post("/", isAuthenticated, isAdmin, createCategory);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:categoryId", isAuthenticated, isAdmin, deleteCategory);

/**
 * @swagger
 * /api/categories/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Returns a list of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 */
router.get("/subcategories", getSubcategories);

/**
 * @swagger
 * /api/categories/subcategories:
 *   post:
 *     summary: Create a new subcategory (Admin only)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jeans"
 *               description:
 *                 type: string
 *                 example: "Denim jeans for men"
 *               category:
 *                 type: string
 *                 example: "67cdf5ff9b23fa88664dca49"
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 */
router.post("/subcategories", isAuthenticated, isAdmin, createSubcategory);

/**
 * @swagger
 * /api/categories/subcategories/{subcategoryId}:
 *   delete:
 *     summary: Delete a subcategory (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 */
router.delete(
  "/subcategories/:subcategoryId",
  isAuthenticated,
  isAdmin,
  deleteSubcategory
);

export default router;
