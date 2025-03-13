import { Request, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import mongoose from "mongoose";

// Fetch user's cart (authenticated user)
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.json({ message: "Guest cart. Store items in localStorage." });
      return;
    }

    const cart = await Cart.findOne({ user: req.user.userId }).populate({
      path: "items.product",
      populate: ["category", "subcategory"],
    });

    if (!cart) {
      res.json({ items: [], total: 0 });
      return;
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Add product variant to cart (logged-in users)
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId || !variantId) {
      res
        .status(400)
        .json({ message: "Product ID and Variant ID are required" });
      return;
    }

    if (!req.user) {
      res.json({ message: "Guest cart. Store items in localStorage." });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const variantExists = product.variants.some(
      (variant) => variant._id?.equals(variantId) ?? false
    );
    if (!variantExists) {
      res.status(404).json({ message: "Variant not found" });
      return;
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        items: [{ product: productId, variantId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.product.equals(productId) && item.variantId.equals(variantId)
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, variantId, quantity });
      }
    }

    await cart.save(); // pre-save hook calculates total price automatically
    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Remove from cart (using in-place splice modification)
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId, variantId } = req.body;

    if (!productId || !variantId) {
      res.status(400).json({ message: "Product ID and variant ID required." });
      return;
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found." });
      return;
    }

    // Modify DocumentArray in-place
    for (let i = cart.items.length - 1; i >= 0; i--) {
      if (
        cart.items[i].product.equals(productId) &&
        cart.items[i].variantId.equals(variantId)
      ) {
        cart.items.splice(i, 1);
      }
    }

    // If cart is empty, delete it
    if (cart.items.length === 0) {
      await Cart.deleteOne({ user: userId });
      res.json({ message: "Cart is empty now", total: 0 });
      return;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};

// Clear all items from the user's cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found." });
      return;
    }

    // Clear the cart items using splice (in-place modification)
    cart.items.splice(0, cart.items.length);

    // Reset total price to 0 explicitly
    cart.total = 0;

    await cart.save();

    res.json({ message: "Cart cleared successfully.", cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
