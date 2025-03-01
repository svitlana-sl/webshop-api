import express from "express";
import { registerUser, loginUser, getUsers, deleteUser } from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route to fetch all users (Requires authentication)
router.get("/", isAuthenticated, getUsers);

// Route to delete a user by ID (Requires authentication)
router.delete("/:id", isAuthenticated, deleteUser);

export default router;
