import express from "express";
import { registerUser } from "../controllers/userController";
import { RequestHandler } from "express"; // Import the RequestHandler type from Express
const router = express.Router();

// Route for user registration
router.post("/register", registerUser as RequestHandler);

export default router;
