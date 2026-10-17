import { z } from "zod";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().max(100).default(5),
  search: z.string().trim().optional(),
  tab: z.string().trim().optional(),
});

export default paginationSchema;
