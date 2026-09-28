import { z } from "zod";

// user register
const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["admin", "seller", "user"]).default("user"),
  avater: z
    .object({
      url: z.string().nullable().default(null),
      public_id: z.string().nullable().default(null),
    })
    .optional(),
  status: z.enum(["pending", "active", "inactive"]).default("pending"),
  method: z.enum(["google", "manually"]).default("manually"),
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// seller
const sellerRegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const sellerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// admin

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export {
  userRegistrationSchema,
  userLoginSchema,
  sellerRegisterSchema,
  sellerLoginSchema,
  adminLoginSchema,
};
