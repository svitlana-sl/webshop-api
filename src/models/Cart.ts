import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Guest cart without userId
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, default: 0 }, // Total price
  },
  { timestamps: true }
);

// Calculate total price before saving the cart
CartSchema.pre("save", async function (next) {
  const cart = this;
  let calculatedTotal = 0;

  for (const item of cart.items) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      calculatedTotal += product.price * item.quantity;
    }
  }

  cart.total = calculatedTotal;
  next();
});

export const Cart = mongoose.model("Cart", CartSchema);
