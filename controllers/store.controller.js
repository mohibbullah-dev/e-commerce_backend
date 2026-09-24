import { Store } from "../models/shop.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";

const storeCreate = asyncHander(async (req, res) => {
  const { name, email, phone, street, city, state, postalCode, country } =
    req.body;
  const fileUrl = req.file;
  console.log("file :", fileUrl);

  if (
    [name, email, phone, street, city, state, postalCode, country].some(
      (fields) => fields === "",
    )
  )
    throw new apiError(400, "all fields are required!");
  const isStoreExists = await Store.findOne({ email });

  if (isStoreExists) throw new apiError(400, "store already exists");

  const store = await Store.create({
    sellerId: req.user?._id,
    name,
    email,
    contact: [
      {
        phone: phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country,
        },
      },
    ],
  });

  res
    .status(201)
    .json(new apiResponse(200, "store created successfully", store));
});

const storeStatusChange = asyncHander(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new apiError(400, "status is required");
  const { storeId } = req.params;
  console.log("storeId :", storeId);
  const store = await Store.findById(storeId);
  if (!store) throw new apiError(404, "store not found");
  store.status = status;
  await store.save();
  res
    .status(200)
    .json(new apiResponse(200, "store's status updated successfully", store));
});

const deleteStore = asyncHander(async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findByIdAndDelete(storeId);
  if (!store) throw new apiError(404, "store not found");

  res
    .status(200)
    .json(new apiResponse(200, "sotre deleted successfully", store));
});

export { storeCreate, storeStatusChange, deleteStore };
