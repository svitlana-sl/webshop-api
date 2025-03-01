import express from "express";
import { registerUser, loginUser, getUsers, deleteUser } from "../controllers/userController";

const router = express.Router();

// Route for user registration
router.post("/register", (req, res) => {
  registerUser(req, res).catch((err) => console.error(err));
});

// Route for user login
router.post("/login", (req, res) => {
  loginUser(req, res).catch((err) => console.error(err));
});

// Route to fetch all users
router.get("/", (req, res) => {
  getUsers(req, res).catch((err) => console.error(err));
});

// Route to delete a user by ID
router.delete("/:id", (req, res) => {
  deleteUser(req, res).catch((err) => console.error(err));
});

export default router;
