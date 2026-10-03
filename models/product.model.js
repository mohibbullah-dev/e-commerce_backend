import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { nanoid } from "nanoid";

// shop object
// category object
// name string
// slug string
// description
// images array of object [{}]
// tags array[string]
// price number
// discounted_price number
// stock number
// sold_counted number
// ratings_average number
// rating_countes number
// status enum []

const productSchema = new Schema(
  {
    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "shop id is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "category is required"],
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
    },
    descirption: {
      type: String,
      required: [true, "description is required"],
    },
    iamge: [
      {
        url: { type: String, required: [true, "product image is required"] },
        public_id: { type: String },
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    orginal_price: {
      type: Number,
      required: [true, "orginal price is required"],
      min: 0,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: [true, "descounted_price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      default: 0,
      min: 0,
    },
    sold_counted: {
      type: Number,
      required: [true, "sold_counted is required"],
      default: 0,
      min: 0,
    },
    ratings_verage: {
      type: Number,
      required: [true, "ratings_verage is requried"],
      default: 0,
      min: 0,
      max: 5,
    },
    rating_counted: {
      type: Number,
      required: [true, "rating_counted is required"],
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "draft", "out_of_stock", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

productSchema.pre("validate", async () => {
  if (this.isNew) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${nanoid(6)}`;
  }
});
export const Product = mongoose.model("Product", productSchema);
