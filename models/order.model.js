import mongoose, { Schema } from "mongoose";
import { required } from "zod/mini";

const itemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const subOrderSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  items: {
    type: [itemSchema],
    required: true,
  },
  subTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivery", "cancelled"],
    default: "pending",
  },
});

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sub_orders: {
      type: [subOrderSchema],
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping_address: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postal_code: {
        type: String,
        required: true,
      },
    },
    payment_method: {
      type: String,
      enum: ["cod", "stripe"],
      default: "cod",
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "unpaid", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

orderSchema.index({ "subOrderSchema.store": 1, createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
