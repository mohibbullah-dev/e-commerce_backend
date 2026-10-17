import { Store } from "../models/shop.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";
import {
  destroyImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/upload.js";

const storeCreate = asyncHander(async (req, res) => {
  const { name, email, phone, street, city, state, postalCode, country } =
    req.body;
  const logo_path = req.files?.logo?.[0];
  const banner_path = req.files?.banner?.[0];

  const logo = {};
  const banner = {};

  if (logo_path) {
    const result = await uploadImageToCloudinary(logo_path?.path);

    if (result) {
      logo.url = result?.secure_url;
      logo.public_id = result?.public_id;
    }
  }
  if (banner_path) {
    const result = await uploadImageToCloudinary(banner_path?.path);

    if (result) {
      banner.url = result?.secure_url;
      banner.public_id = result?.public_id;
    }
  }

  const storeExists = await Store.findOne({ sellerId: req.user?._id });

  if (storeExists) {
    throw new apiError(400, "You already have a store");
  }

  const store = await Store.create({
    sellerId: req.user?._id,
    name,
    email,
    logo,
    banner,
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

  const accessToken = await req?.user.generateAccessToken(store?._id);

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .json(new apiResponse(200, "store created successfully", store));
});

const updateStore = asyncHander(async (req, res) => {
  const { productId } = req.params;

  const {
    name,
    email,
    phone,
    street,
    city,
    state,
    postalCode,
    country,
    oldLogoPublic_id,
    oldBannerPublic_id,
  } = req.body;

  console.log("oldLogoPublic_id :", oldLogoPublic_id);
  console.log("oldBannerPublic_id :", oldBannerPublic_id);

  const updateData = {};

  // text-data

  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phone) updateData.phone = phone;
  if (street) updateData.street = street;
  if (city) updateData.city = city;
  if (state) updateData.state = state;
  if (postalCode) updateData.postalCode = postalCode;
  if (country) updateData.country = country;

  // lgogo and bannernos

  const logo_path = req.files?.logo?.[0];
  const banner_path = req.files?.banner?.[0];

  if (logo_path) {
    const result = await uploadImageToCloudinary(logo_path?.path);

    if (result) {
      updateData["logo.url"] = result?.secure_url;
      updateData["logo.public_id"] = result?.public_id;
    }
    await destroyImageFromCloudinary(oldLogoPublic_id);
  }
  if (banner_path) {
    const result = await uploadImageToCloudinary(banner_path?.path);

    if (result) {
      updateData["banner.url"] = result?.secure_url;
      updateData["banner.public_id"] = result?.public_id;
    }

    await destroyImageFromCloudinary(oldBannerPublic_id);
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, "Nothing to update", null));
  }

  const update_result = await Store.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true },
  );

  if (!update_result) throw new apiError(404, "store not found");
  return res
    .status(200)
    .json(new apiResponse(200, "store updated successfully", update_result));
});

const storeStatusChange = asyncHander(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new apiError(400, "status is required");
  const { storeId } = req.params;

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

const myStore = asyncHander(async (req, res) => {
  const sellerId = req.user?._id;
  console.log("req.store._id", req.store?._id);

  const store = await Store.findOne({ sellerId: sellerId });
  if (!store) throw new apiError(404, "store not found");

  return res
    .status(200)
    .json(new apiResponse(200, "my-store fetched successfully", store));
});

export { storeCreate, storeStatusChange, deleteStore, myStore, updateStore };
