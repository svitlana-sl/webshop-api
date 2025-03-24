import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // express-validator validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((err) => ({ [err.param]: err.msg }));
    res
      .status(400)
      .json({ message: "Validation error", errors: extractedErrors });
    return;
  }

  try {
    // Мінімально обов'язкові поля: email та password.
    // Якщо firstName або lastName не передані, задаємо значення за замовчуванням "N/A"
    const { email, password, firstName, lastName, phone, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName: firstName && firstName.trim() !== "" ? firstName : "N/A",
      lastName: lastName && lastName.trim() !== "" ? lastName : "N/A",
      phone,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // express-validator validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors
      .array()
      .map((err) => ({ [err.param]: err.msg }));
    res
      .status(400)
      .json({ message: "Validation error", errors: extractedErrors });
    return;
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
