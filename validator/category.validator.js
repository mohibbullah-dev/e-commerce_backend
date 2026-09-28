import { z } from "zod";

const addCategorySchema = z.object({
  cat_name: z.string(),
  image: z
    .object({
      url: z.string().nullable().default(null),
      public_id: z.string().nullable().default(null),
    })
    .optional(),
});

const getCategorySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
  search: z.string().trim().min(1).max(100).optional(),
});

export { addCategorySchema, getCategorySchema };
