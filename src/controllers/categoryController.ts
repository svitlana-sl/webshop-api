import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Subcategory } from "../models/Subcategory";

// get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// create new category(Admin only)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// get all subcategories
export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const subcategories = await Subcategory.find().populate("category");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

// create new subcategory (Admin only)
export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;
    const newSubcategory = new Subcategory({ name, description, category });
    await newSubcategory.save();
    res.status(201).json(newSubcategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating subcategory", error });
  }
};
