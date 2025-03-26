import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        image: {
            type: String,
            default: "",
          },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        phone: { type: String },
        role: { type: String, enum: ["customer", "admin"], default: "customer" },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

