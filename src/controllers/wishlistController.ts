import { Request, Response } from "express";
import { Wishlist } from "../models/Wishlist.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";

// Get user's wishlist
export const getWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
      "name images"
    );

    if (!wishlist) {
      res.json({ products: [] }); // empty wishlist
      return;
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

// Add product to wishlist
export const addToWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const productExists = await Product.findById(productId);
    if (!productExists) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        res.status(400).json({ message: "Product already in wishlist" });
        return;
      }
      wishlist.products.push(productId);
    }

    await wishlist.save();
    res.status(201).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid product ID" });
      return;
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products", "name images");

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    res.json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

export const clearWishlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      res.status(404).json({ message: "Wishlist not found" });
      return;
    }

    wishlist.products = []; // clear the wishlist
    await wishlist.save();

    res.json({ message: "Wishlist cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing wishlist", error });
  }
};
