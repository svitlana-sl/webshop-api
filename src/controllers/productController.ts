import { Request, Response } from "express";
import { Product } from "../models/Product";

// get all products with optional filters
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, subcategory, size, color } = req.query;
    let filter: any = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (size) filter["variants.size"] = size;
    if (color) filter["variants.color"] = color;

    const products = await Product.find(filter)
      .populate("category")
      .populate("subcategory");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// get product by id
export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("subcategory");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving product", error });
  }
};

// create new product (only admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// delete product by id (only admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
