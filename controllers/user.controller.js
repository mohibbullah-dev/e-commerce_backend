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
  console.log(
    "hello i am in adminLogin before db qurey in controller function",
  );
  const user = await User.findOne({ email: email });
  console.log(user);
  console.log("hello i am in adminLogin after db qurey in controller function");
  console.log(user);
  if (!user) {
    throw new apiError(404, "user not found");
  }

  const isMatchPass = await user.isCorrectPassword(password);
  if (!isMatchPass) throw new apiError(400, "incorrect password");

  const accessToken = await user.accessToken();

  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  console.log(
    "hello i am in adminLogin before response in controller function",
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, option)
    .json(new apiResponse(200, user, "login successfully done"));
});

export { adminLogin };
