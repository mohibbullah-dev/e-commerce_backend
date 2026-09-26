import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    catgory_name: {
      type: String,
      required: [true, "name should be unique"],
      unique: true,
    },
    category_slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
      trim: true,
    },
    image: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true },
);

categorySchema.index({ catgory_name: "text" });

export const Category = mongoose.model("Category", categorySchema);
