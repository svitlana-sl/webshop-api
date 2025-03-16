import { Request, Response } from "express";
import { Category } from "../models/Category";
import { Subcategory } from "../models/Subcategory";

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// Create new category (Admin only)
export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Optionally, delete all related subcategories
    await Subcategory.deleteMany({ category: categoryId });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

// Get all subcategories
export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const subcategories = await Subcategory.find().populate("category");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

// Create new subcategory (Admin only)
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

// Delete subcategory (Admin only)
export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const { subcategoryId } = req.params;

    const deletedSubcategory = await Subcategory.findByIdAndDelete(
      subcategoryId
    );
    if (!deletedSubcategory) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }

    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error });
  }
};
