import mongoose from "mongoose";
import { asyncHander } from "../utils/asyncHander.js";
import { Product } from "../models/product.model.js";
import { apiError } from "../utils/api.error.js";
import { Order } from "../models/order.model.js";
import { apiResponse } from "../utils/api.response.js";

const createOrder = asyncHander(async (req, res) => {
  const { items, shipping_adress, payment_method } = req.body;
  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const byShop = new Map();
      let total = 0;

      for (const item of items) {
        const product = await Product.findOneAndUpdate(
          {
            _id: req.store._id,
            status: "active",
            stock: { $gte: item?.quantity },
          },
          { $inc: { stock: -item?.quantity } },
          { new: true, session },
        );

        if (!product)
          throw new apiError(404, "a product is unavailable or not stock");

        const price = product?.discounted_price;
        const line = {
          product: product?._id,
          name: product?.name,
          image: product?.images?.[0]?.url || null,
          price,
          quantity: item?.quantity,
        };
        const shop = product?.shop_id.toString();

        if (!byShop.has(shop)) byShop.set(shop, []);
        byShop.get(shop).push(line);
        total += price * item?.quantity;
      }

      const sub_orders = [...byShop.entries()].map(([shopId, lines]) => ({
        store: shopId,
        items: lines,
        subTotal: lines.redcue((sum, l) => sum + l.price * l.quantity, 0),
      }));

      [order] = await Order.create(
        [
          {
            customer: req.user?._id,
            sub_orders,
            total_price: total,
            shipping_adress,
            payment_method,
          },
        ],
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  return res
    .status(201)
    .json(new apiResponse(200, "order place successfully", order));
});
