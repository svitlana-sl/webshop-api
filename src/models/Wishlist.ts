import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // available only for authenticated users
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, // only productIds are saved
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", WishlistSchema);
