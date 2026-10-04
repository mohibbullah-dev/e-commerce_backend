import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().trim().min(1, "product_name is required"),
  category: z.string().trim().min(1, "category is required"),
  description: z.string().trim().min(1, "description is required"),
  orginal_price: z.number().trim().min(0, "orginal_price is required"),
  discounted_price: z.number().trim().min(0, "descounted_price is required"),
  iamge: e.array(
    e.object({
      url: e.string().trim().min(1, "image is required"),
      public_id: e.string().trim(),
    }),
  ),
  tags: e.array(e.string().toLowerCase().optional()),
});

export { createProductSchema };

export const updateProductSchema = z.createProductSchema.partial();
