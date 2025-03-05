import { Request, Response } from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import mongoose from "mongoose";

// get cart localStorage or DB
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.json({ message: "Guest cart. Store items in localStorage." });
      return;
    }

    const cart = await Cart.findOne({ user: req.user.userId }).populate(
      "products.product"
    );

    if (!cart) {
      res.json({ user: req.user.userId, products: [], totalPrice: 0 });
      return;
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// add to cart logged in user
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, variantId, quantity } = req.body;

    if (!productId || !variantId || quantity <= 0) {
      res
        .status(400)
        .json({ message: "Invalid product ID, variant ID, or quantity" });
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

    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );
    if (!variant) {
      res.status(404).json({ message: "Variant not found" });
      return;
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({
        user: req.user.userId,
        products: [{ product: productId, variantId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (item) =>
          item.product.equals(productId) && item.variantId.equals(variantId)
      );

      if (existingProduct) {
        existingProduct.quantity += quantity; // update quantity
      } else {
        cart.products.push({ product: productId, variantId, quantity });
      }
    }

    await cart.save(); // save cart with updated products and `totalPrice`

    res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// remove from cart
export const removeFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.json({ message: "Guest cart. Store items in localStorage." });
      return;
    }

    const { productId, variantId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      res.status(400).json({ message: "Invalid product ID or variant ID" });
      return;
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.userId },
      { $pull: { products: { product: productId, variantId } } },
      { new: true }
    ).populate("products.product");

    if (!cart) {
      res.json({ user: req.user.userId, products: [], totalPrice: 0 });
      return;
    }

    if (cart.products.length === 0) {
      await Cart.deleteOne({ user: req.user.userId });
      res.json({ message: "Cart is empty now", totalPrice: 0 });
      return;
    }

    res.json(cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart", error });
  }
};
