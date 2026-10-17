import { z } from "zod";

const addCategorySchema = z.object({
  cat_name: z.string(),
});
export { addCategorySchema };

// partial schemas
export const UpdateCategorySchema = addCategorySchema.partial();
