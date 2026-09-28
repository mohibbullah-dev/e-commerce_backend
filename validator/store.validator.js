import { z } from "zod";

// const addressSchema = z.object({
//   street: z.string().trim().min(1, "street is required"),
//   city: z.string().trim().min(1, "city is required"),
//   state: z.string().trim().min(1, "state is required"),
//   postalCode: z.coerce.number(),
//   country: z.string().trim().min(1, "country is required"),
// });

// const contackSchema = z.object({
//   phone: z.string().min(1, "phone is required"),
//   address: addressSchema,
// });

const storeCreateSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  email: z.string().trim().toLowerCase().email(),
  street: z.string().trim().min(1, "street is required"),
  city: z.string().trim().min(1, "city is required"),
  state: z.string().trim().min(1, "state is required"),
  postalCode: z.coerce.number(),
  country: z.string().trim().min(1, "country is required"),
  phone: z.string().min(1, "phone is required"),
});

export { storeCreateSchema };
export const storeUpdateSchema = storeCreateSchema.partial();
