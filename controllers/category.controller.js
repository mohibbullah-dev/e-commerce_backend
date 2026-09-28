import { Category } from "../models/category.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";
import { escapeRegex } from "../utils/escapeRegex.js";

// create category
const addCategory = asyncHander(async (req, res) => {
  const { cat_name } = req.body;
  const cat_image = req.file?.path;

  const category = await Category.create({
    category_name: cat_name,
    category_slug: cat_name.split(" ").join("_"),
    image: {
      url: cat_image,
      public_id: null,
    },
  });

  return res
    .status(200)
    .json(new apiResponse(200, "category created successfully", category));
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
    new apiResponse(200, {
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

export { addCategory, getCategories };
