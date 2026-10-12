import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile:{
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    cartItems: {
      type: [
        new mongoose.Schema(
          {
            product: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              min: 1,
              max: 99,
              validate: Number.isInteger,
            },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    wishlistItems: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
    shoppingDataInitialized: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;