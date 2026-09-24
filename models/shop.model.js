import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const address = new Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: Number,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const storeSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      uniuqe: true,
    },

    logo: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    banner: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    contact: [
      {
        _id: false,
        phone: {
          type: String,
          required: true,
        },
        address: address,
      },
    ],
  },
  { timestamps: true },
);

export const Store = mongoose.model("Store", storeSchema);
