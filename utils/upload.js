import { v2 as cloudinary } from "cloudinary";
import { apiError } from "./api.error.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || dbrzjrqbm,
  api_key: process.env.CLOUDINARY_API_KEY || 163237136896738,
  api_secret: process.env.CLOUDINARY_API_SECRET || NW6sCArdQyqsJoO80STWTyp603Y,
});

const uploadImageToCloudinary = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    const result = await cloudinary.uploader.upload(imagePath, options);

    return result;
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

const destroyImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new apiError(500, error.message);
  }
};

export { uploadImageToCloudinary, destroyImageFromCloudinary };
