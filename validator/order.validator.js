import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const createOrderValidationSchema = z.object({
  items: z.array(
    z.object({
      producId: objectId,
      quantity: z.coerce.number().min(1).max(20),
    }),
  ),
  shipping_address: z.object({
    name: z.string().trim().min(0),
    phone: z.string().trim().min(6).max(20),
    street: z.string().trim().min(1),
    city: z.string().trim().min(1),
    postal_code: z.string().trim().min(1),
  }),
  payment_method: z.enum(["cod"]).default("cod"),
});

export const updateOrderStatusValidationSchema = z.object({
  status: z.enum(["processing", "shipped", "delivery", "cancelled"]),
});

export const orderIdValidationSchema = z.object({
  orderId: objectId,
});
