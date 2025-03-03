import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],
    variants: [
      {
        size: { type: String },
        color: { type: String },
      },
    ],
    ratings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
