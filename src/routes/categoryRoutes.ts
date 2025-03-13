import express from "express";
import {
  getCategories,
  createCategory,
  getSubcategories,
  createSubcategory,
} from "../controllers/categoryController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

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
 */
router.post("/", isAuthenticated, isAdmin, createCategory);

/**
 * @swagger
 * /api/subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Categories]
 */
router.get("/subcategories", getSubcategories);

/**
 * @swagger
 * /api/subcategories:
 *   post:
 *     summary: Create a new subcategory (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post("/subcategories", isAuthenticated, isAdmin, createSubcategory);

export default router;
