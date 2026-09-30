import { Category } from "../models/category.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";
import { escapeRegex } from "../utils/escapeRegex.js";
import {
  destroyImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/upload.js";

// create category
const addCategory = asyncHander(async (req, res) => {
  const { cat_name } = req.body;
  const cat_image = req.file?.path;

  const result = await uploadImageToCloudinary(cat_image);

  const category = await Category.create({
    category_name: cat_name,
    category_slug: cat_name.split(" ").join("_"),
    image: {
      url: result?.secure_url,
      public_id: result?.public_id,
    },
  });

  return res
    .status(200)
    .json(new apiResponse(200, "category created successfully", category));
});

const updateCategory = asyncHander(async (req, res) => {
  const { categoryId } = req.params;
  const cat_image = req.file?.path;

  const { cat_name } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) throw new apiError(404, "category not found!");

  let updateData = {};

  if (cat_name) {
    updateData.category_name = cat_name;
    updateData.category_slug = cat_name.trim().split(" ").join("_");
  }

  if (req.file && req.file?.path) {
    const result = await uploadImageToCloudinary(cat_image);
    if (category?.image?.public_id) {
      await destroyImageFromCloudinary(category?.image?.public_id);
    }
    updateData.image = {
      url: result?.secure_url,
      public_id: result?.public_id,
    };
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    { new: true },
  );
  return res
    .status(200)
    .json(
      new apiResponse(200, "Category updated successfully", updatedCategory),
    );
});

// get categories
const getCategories = asyncHander(async (req, res) => {
  // get queries from 'req.query'
  // set default value in variable comming frontend (max, min page and limit using Max(), and Min())
  // defin a skip valiable like: limit * (page -1)
  // define a filter empty object
  // asign appropriat query to object
  // use the Promise.all method to make parallar queries
  // then response estimating pages values
  const { page, limit, search } = req.validedQuery;

  const skip = (page - 1) * limit;
  const filter = {};
  if (search) {
    filter.category_name = { $regex: escapeRegex(search), $options: "i" };
  }

  const [categoris, totalItem] = await Promise.all([
    Category.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(filter),
  ]);

  return res.status(200).json(
    new apiResponse(200, "Fetched all categories", {
      categoris,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalItem / limit),
        totalItem,
        itemPerPage: limit,
        hasNextPage: page < Math.ceil(totalItem / limit),
        hasPrevPage: page > 1,
      },
    }),
  );
});

// delete categories
const deleteCategory = asyncHander(async (req, res) => {
  const { categor_id } = req.params;
  console.log("categor_id :", categor_id);

  const category = await Category.findByIdAndDelete(categor_id);
  if (!category) throw new apiError(404, "category not found");
  return res
    .status(200)
    .json(new apiResponse(200, "Category deleted successfully!", category));
});

export { addCategory, getCategories, deleteCategory, updateCategory };
