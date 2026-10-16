import { Product } from "../models/product.model.js";
import { Store } from "../models/shop.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";
import {
  destroyImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/upload.js";

const createProduct = asyncHander(async (req, res) => {
  const sellerId = req.user?._id;
  console.log("sellerId :", sellerId);

  const {
    name,
    brand_name,
    descirption,
    category,
    tags,
    orginal_price,
    discounted_price,
    stock,
  } = req.body;
  if (!req.files || req.files.length === 0)
    throw new apiError(400, "At least one photo is required");

  const files = req.files;
  const uploadResult = await Promise.all(
    files.map((file) => uploadImageToCloudinary(file?.path)),
  );

  if (!uploadResult || uploadResult.length === 0)
    throw new apiError(500, "image upload to cloudinary failed");

  const images = uploadResult.map((r) => {
    return { url: r.secure_url, public_id: r.public_id };
  });

  const shop = await Store.findOne({ sellerId: sellerId });
  console.log("shop ", shop);
  if (!shop) throw new apiError(404, "store not found");

  console.log("shop ", shop);

  const product = await Product.create({
    shop_id: shop?._id,
    name,
    brand_name,
    descirption,
    category,
    images,
    tags,
    orginal_price,
    discounted_price,
    stock,
    sold_counted: 0,
    ratings_verage: 0,
    rating_counted: 0,
    status: "active",
  });

  return res
    .status(200)
    .json(new apiResponse(200, "product created successfully", product));
});

const updateProduct = asyncHander(async (req, res) => {
  const { productId } = req.params;
  const {
    name,
    descirption,
    category,
    tags,
    orginal_price,
    discounted_price,
    stock,
  } = req.body;
  let updateData = {};
  let queryFilter = { _id: productId };

  if (name) updateData.name = name;
  if (descirption) updateData.descirption = descirption;
  if (category) updateData.category = category;
  if (orginal_price) updateData.orginal_price = orginal_price;
  if (discounted_price) updateData.discounted_price = discounted_price;
  if (stock) updateData.stock = stock;

  if (tags) {
    updateData.tags = tags;
  }

  if (Object.keys(updateData).length > 0) {
    return res
      .status(200)
      .json(new apiResponse(200, "nothing to update", null));
  }

  const update = await Product.findOneAndUpdate(
    queryFilter,
    { $set: updateData },
    { new: true },
  );
  if (!update) throw new apiError(404, "product not found or tag is mismatch");

  return res
    .status(200)
    .json(new apiResponse(200, "product updated successfully", update));
});

const addSingleProductImage = asyncHander(async (req, res) => {
  const { productId } = req.params;
  const file = req.file;

  if (!file) throw new apiError(400, "please select a image");

  const cloudinary_res = await uploadImageToCloudinary(file?.path);

  if (!cloudinary_res)
    throw new apiError(500, "image upload to cloudinary failed");

  const uploadedImage = await Product.findOneAndUpdate(
    { _id: productId },
    {
      $push: {
        images: {
          url: cloudinary_res?.secure_url,
          public_id: cloudinary_res?.public_id,
        },
      },
    },
    { new: true },
  );

  if (!uploadedImage) throw new apiError(404, "product not found");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        "singleProductImage uploaded successfully",
        uploadedImage,
      ),
    );
});

// updateSIngleProductImage

const updateSingleProductImage = asyncHander(async (req, res) => {
  const { productId } = req.params;
  const { oldImagePublic_id } = req.body;

  const file = req.file;

  if (!file) throw new apiError(404, "please upload a new image");

  const uploadedImage = await uploadImageToCloudinary(file?.path);

  if (!uploadedImage)
    throw new apiError(500, "image upload to cloudinary failed");

  await destroyImageFromCloudinary(oldImagePublic_id);

  const uploadNewImage = await Product.findOneAndUpdate(
    { _id: productId, "images.public_id": oldImagePublic_id },
    {
      $set: {
        "images.$.url": uploadedImage?.secure_url,
        "images.$.public_id": uploadedImage?.public_id,
      },
    },
    { new: true },
  );

  if (!uploadNewImage) throw new apiError(404, "product or image not found");

  return res
    .status(200)
    .json(new apiResponse(200, "image updated successfully", uploadNewImage));
});

// single image delete

const deleteSingleProductImage = asyncHander(async (req, res) => {
  console.log("hello am in deleteSingleProductImage");
  const { imagePublic_id } = req.body;
  const { productId } = req.params;

  if (!imagePublic_id || !productId) {
    throw new apiError(400, "product ID and img public_id are required");
  }

  const deletedImage = await Product.findByIdAndUpdate(
    {
      _id: productId,
    },
    { $pull: { images: { public_id: imagePublic_id } } },
    { new: true },
  );

  if (!deletedImage) throw new apiError(404, "product not found");

  await destroyImageFromCloudinary(imagePublic_id);

  return res
    .status(200)
    .json(new apiResponse(200, "image deleted successfully", deletedImage));
});

const deleteProduct = asyncHander(async (req, res) => {
  console.log("i am in delete product controller");
  const { productid } = req.params;
  if (!productid) throw new apiError(400, "productId is required!");

  const deletedProduct = await Product.findByIdAndDelete(productid);
  if (!deletedProduct) throw new apiError(404, "product not found");

  return res
    .status(200)
    .json(new apiResponse(200, "product delete successfully", deleteProduct));
});

const getAll_MyProducts_withPagination = asyncHander(async (req, res) => {
  const { page, limit, search, tab } = req.validedQuery;

  console.log("page :", page);
  console.log("limit :", limit);
  console.log("search :", search);
  console.log("tab:", tab);

  const skip = (page - 1) * limit;

  const filter = { shop_id: req.store?._id };
  let project = {};
  let sort = { createdAt: -1 };

  if (search) {
    filter.$text = { $search: search };
    project = { score: { $meta: "textScore" } };
    sort = { score: { $meta: "textScore" } };
  }
  if (tab) {
    switch (tab) {
      case "active":
        filter.status = "active";
        break;

      case "draft":
        filter.status = "active";
        break;

      case "out_of_stock":
        filter.$or = [{ stock: { $lt: 0 } }, { status: "out_of_stock" }];
        break;

      case "archived":
        filter.status = "archived";
        break;

      case "discounted_price":
        filter.discounted_price = { $gt: 0 };
        break;

      case "all":
      default:
        break;
    }
  }

  const [products, totalProducts] = await Promise.all([
    Product.find(filter, project)
      .skip(skip)
      .sort(sort)
      .limit(limit)
      .populate("category", "category_name"),
    Product.countDocuments(filter),
  ]);

  return res.status(200).json(
    new apiResponse(200, "all products fetched", {
      products,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalProducts / limit),
        totalProducts,
        itemPerPage: limit,
        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPrevPage: page > 1,
      },
    }),
  );
});
const myProduct = asyncHander(async (req, res) => {
  const { productId } = req.params;

  if (!productId) throw new apiError(400, "product_id is required");
  const product = await Product.findById(productId).populate(
    "category",
    "category_name _id",
  );
  if (!product) throw new apiError(404, "product not found");
  return res
    .status(200)
    .json(new apiResponse(200, "fetched single_product", product));
});

export {
  createProduct,
  updateProduct,
  updateSingleProductImage,
  deleteSingleProductImage,
  addSingleProductImage,
  deleteProduct,
  getAll_MyProducts_withPagination,
  myProduct,
};
