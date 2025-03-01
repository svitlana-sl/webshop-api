import express from "express";
import { registerUser, loginUser, getUsers, deleteUser } from "../controllers/userController";
import { RequestHandler } from "express"; // Import the RequestHandler type from Express
const router = express.Router();

// Route for user registration
router.post("/register", registerUser as RequestHandler);
// Route for user login
router.post("/login", loginUser as RequestHandler);
export default router;

// Route to fetch all users (admin only in the future)
router.get("/", getUsers as RequestHandler);

// Route to delete a user by ID (admin only in the future)
router.delete("/:id", deleteUser as RequestHandler);