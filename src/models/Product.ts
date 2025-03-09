import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // unique id for each variant
  size: { type: String, required: true },
  color: { type: String, required: true },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" }, // subcategory added to the product
    price: { type: Number, required: true },
    images: [{ type: String }],
    variants: [VariantSchema], // array of variants (each has _id, size, color)
    ratings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
