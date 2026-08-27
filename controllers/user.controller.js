import { User } from "../models/user.model.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHander } from "../utils/asyncHander.js";

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

  const user = await User.findOne({ email: email });

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
    maxAge: 7 * 24 * 60 * 60 * 1000,
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

  const user = await User.findOne({ email: email });
  if (!user) throw new apiError(404, "user not found");

  const isMatchPass = await user.isCorrectPassword(password);
  if (!isMatchPass) throw new apiError(400, "incorrect password");
  const accessToken = await user.generateAccessToken();

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .json(new apiResponse(200, "seller login done successfully", { user }));
});

// get_user start from here
const get_user = asyncHander(async (req, res) => {
  const user = req?.user;

  res
    .status(200)
    .json(new apiResponse(200, "user fetched successfully", { user }));
});

export { adminLogin, get_user, sellerLogin };
