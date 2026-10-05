import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().trim().min(1, "product_name is required"),
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

export { createProductSchema };

export const updateProductSchema = createProductSchema.partial();
