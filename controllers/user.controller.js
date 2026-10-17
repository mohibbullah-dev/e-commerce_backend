import { Store } from "../models/shop.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";
import {
  destroyImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/upload.js";

const adminLogin = asyncHander(async (req, res) => {
  // get user_info from frontend
  // validate user_info
  // find the user in db using email or password
  // validate the user from db
  // validate the password
  // genarate accessToken
  // send the accessToken with coockie
  // response finally to user
  const { email, password } = req.body;

  if ([email, password].some((fields) => fields.trim() === "")) {
    throw new apiError(400, "ALl fields are required");
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new apiError(404, "user not found");
  }

  const isMatchPass = await user.isCorrectPassword(password);

  if (!isMatchPass) throw new apiError(400, "incorrect password");

  const accessToken = await user.generateAccessToken();

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .json(
      new apiResponse(200, "login successfully done", {
        user,
        token: accessToken,
      }),
    );
});

// seller
const sellerRegister = asyncHander(async (req, res) => {
  const { name, email, password } = req.body;

  const seller = await User.create({
    name,
    email,
    password,
    role: "seller",
    status: "pending",
    method: "manually",
  });

  res
    .status(201)
    .json(new apiResponse(200, "seller registered successfully", seller));
});

const sellerStatusChanged = asyncHander(async (req, res) => {
  const { status } = req.body;
  console.log("status :", status);
  const { sellerId } = req.params;
  if (!status) throw new apiError(400, "status fields is required");

  console.log("sellerId", sellerId);
  const seller = await User.findOne({ _id: sellerId }).select("-password");
  console.log("seller :", seller);
  if (!seller) throw new apiError(404, "seller not found");

  seller.status = status;
  await seller.save();

  res
    .status(200)
    .json(new apiResponse(200, "seller's status updated successfully", seller));
});

const sellerReject = asyncHander(async (req, res) => {
  const { sellerId } = req.params;
  const seller = await User.findById(sellerId).select("-password");
  if (!seller) throw new apiError(400, "seller not found");

  if (seller.status === "inactive")
    throw new apiError(400, "user already inactive!");

  seller.status = "inactive";
  await seller.save();

  res
    .status(200)
    .json(new apiResponse(200, "seller inactive succefully", seller));
});

const sellerLogin = asyncHander(async (req, res) => {
  // get seller login info
  // validate them
  // query in db
  // validate db doc object
  // compare passwore
  // genarate token
  // send the token with cookie
  // and finally send response to cleint

  const { email, password } = req.body;

  if ([email, password].some((fields) => fields.trim() === ""))
    throw new apiError(400, "all fields are required");

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) throw new apiError(404, "user not found");

  const isMatchPass = await user.isCorrectPassword(password);
  if (!isMatchPass) throw new apiError(400, "incorrect password");
  const accessToken = await user.generateAccessToken();

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .json(new apiResponse(200, "seller login done successfully", { user }));
});

// get_user start from here
const userRegister = asyncHander(async (req, res) => {
  const { name, email, password } = req.body;

  // if ([name, email, password].some((fields) => fields === ""))
  //   throw new apiError(400, "all fields are required!");

  // const userExists = await User.findOne({ email }).select("-password");
  // if (userExists) throw new apiError(400, "user already exsits");
  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    method: "manually",
    status: "active",
  });

  res
    .status(201)
    .json(new apiResponse(200, "user registerd successfully!", user));
});

const userLogin = asyncHander(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new apiError(404, "user not found");

  const isPassCorrect = await user.isCorrectPassword(password);
  if (!isPassCorrect) throw new apiError(400, "Incorrect password!");
  const store = await Store.findOne({ sellerId: user._id });

  const token = await user.generateAccessToken(store ? store?._id : null);

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", token, option)
    .json(new apiResponse(200, "user loggedIn successfully", user));
});

const get_user = asyncHander(async (req, res) => {
  const user = req?.user;

  res
    .status(200)
    .json(new apiResponse(200, "user fetched successfully", { user }));
});

const profileInfor_update = asyncHander(async (req, res) => {
  const { name, email } = req.body;

  const updateData = {};

  if (name) updateData.name = name;
  updateData.email = email;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateData },
    { new: true },
  );
  if (!user) throw new apiError(404, "user not found");

  return res
    .status(200)
    .json(new apiResponse(200, "profile updated successfully", user));
});

const password_update = asyncHander(async (req, res) => {
  const { newPassword, oldPassword, email } = req.body;
  console.log("newPassword :", newPassword);
  console.log("oldPassword :", oldPassword);
  console.log("email :", email);

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) throw new apiError(404, "user not found");

  const isMatch = await user.isCorrectPassword(oldPassword);
  if (!isMatch) throw new apiError(400, "ole-password not match");

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new apiResponse(200, "password updated successfully"));
});

const avater_update = asyncHander(async (req, res) => {
  const file = req.file;
  const { oldImage_publicId } = req.body;
  console.log("oldImage_publicId :", oldImage_publicId);
  if (!file) throw new apiError(400, "file is required");

  const result = await uploadImageToCloudinary(file?.path);

  if (!result) throw new apiError(500, "failed to upload image to cloudinary");

  const updated_avater = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        "avater.url": result?.secure_url,
        "avater.public_id": result?.public_id,
      },
    },
    { returnDocument: "after" }, //{new:true} is deprecated with { returnDocument: "after" }
  );

  if (!updated_avater) throw new apiError(404, "user not found");

  if (oldImage_publicId) {
    await destroyImageFromCloudinary(oldImage_publicId);
  }

  return res
    .status(200)
    .json(new apiResponse(200, "avater added successfully", updated_avater));
});

export {
  adminLogin,
  get_user,
  sellerLogin,
  sellerRegister,
  sellerStatusChanged,
  sellerReject,
  userRegister,
  userLogin,
  profileInfor_update,
  password_update,
  avater_update,
};
