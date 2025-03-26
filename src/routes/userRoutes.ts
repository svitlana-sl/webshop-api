import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
} from "../controllers/userController";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware";
import { registerValidator, loginValidator } from "../validators/authValidator";
import { validateRequest } from "../middleware/validateRequest";
import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import { User } from "../models/User"; 
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Johnson
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               role:
 *                 type: string
 *                 example: customer
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email already registered
 */
// Route for user registration with validation
router.post("/register", registerValidator, validateRequest, registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
// Route for user login with validation
router.post("/login", loginValidator, validateRequest, loginUser);

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all users
 *       403:
 *         description: Forbidden, requires admin role
 */
router.get("/", isAuthenticated, isAdmin, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 650c6d9a88a3f2a1f0a56e5d
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden, requires admin role
 *       404:
 *         description: User not found
 */
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);


// Настройка Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Настройка CloudinaryStorage для Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "avatars", // Папка в Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  }),
});

const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

// Route for user registration with validation
router.post("/register", registerValidator, validateRequest, registerUser);

// Route for user login with validation
router.post("/login", loginValidator, validateRequest, loginUser);

// Get all users (admin only)
router.get("/", isAuthenticated, isAdmin, getUsers);

// Delete a user (admin only)
router.delete("/:id", isAuthenticated, isAdmin, deleteUser);

// Upload avatar
/**
 * @swagger
 * /api/users/upload-avatar/{id}:
 *   post:
 *     summary: Upload avatar for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Upload failed
 */
router.post("/upload-avatar/:id", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file || !req.file.path) {
      res.status(400).send("No file uploaded.");
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { image: req.file.path }, 
      { new: true }
    );

    res.status(200).json({
      message: "Avatar uploaded successfully!",
      imageUrl: req.file.path,
      user,
    });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).send("Upload failed.");
  }
});

export default router;
