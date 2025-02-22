import { Request, Response } from "express";
import { User } from "../models/User";
import { Error as MongooseError } from "mongoose";
import bcrypt from "bcrypt";
const { ValidationError } = MongooseError;
// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
