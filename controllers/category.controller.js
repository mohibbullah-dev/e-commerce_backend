import { Category } from "../models/category.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";

const addCategory = asyncHander(async (req, res) => {
  const { cat_name } = req.body;
  const cat_image = req.file?.path;

  if (!cat_name) throw new apiError(400, "category name is required!");

  //   const isCategoryExists = awati Category.create

  const category = await Category.create({
    catgory_name: cat_name,
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

export { addCategory };
