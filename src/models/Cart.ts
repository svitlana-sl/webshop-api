import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Guest cart without userId
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, default: 0 }, // total price
  },
  { timestamps: true }
);

// before saving the cart, calculate `totalPrice`
CartSchema.pre("save", async function (next) {
  const cart = this;
  let total = 0;

  for (const item of cart.products) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  cart.totalPrice = total;
  next();
});

export const Cart = mongoose.model("Cart", CartSchema);
