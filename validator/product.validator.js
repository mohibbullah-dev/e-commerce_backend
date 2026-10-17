import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().trim().min(1, "product_name is required"),
  brand_name: z.string().trim().min(1, "brand_name is required"),
  category: z.string().trim().min(1, "category is required"),
  descirption: z.string().trim().min(1, "description is required"),
  orginal_price: z.coerce.number().int().min(0, "orginal_price is required"),
  discounted_price: z.coerce
    .number()
    .int()
    .min(0, "descounted_price is required"),
  stock: z.coerce.number().int().min(0, "stock is required"),
  images: z.any().optional(),
  tags: z.array(z.string().toLowerCase().optional()),
  oldTag: z.string().trim().optional(),
  newTag: z.string().trim().optional(),
  oldImagePublic_id: z.string().trim().optional(),
});

const productIdSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),
});

export { createProductSchema, productIdSchema };

export const updateProductSchema = createProductSchema.partial();
