import { User } from "../models/user.model.js";
import { apiError } from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import { asyncHander } from "../utils/asyncHander.js";
import { Store } from "../models/shop.model.js";

const verifyToken = asyncHander(async (req, _, next) => {
  // get token from cookies / headers
  // validate token
  // if token not found throw 'not logedin' error
  //decoded token
  //validate docoded token
  //if invalid token throw error 'invalid token'
  // find the data by id in token
  // keep data into req.user (hide the important fields like password and so on)
  // call next method
  // export te verifyToken fn

  const token =
    req.cookies.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");
  if (!token)
    throw new apiError(401, "unauthorized request: No token provided");
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await User.findById(decoded?.id).select("-password");
    if (!user) throw new apiError(400, "invalid accessToken token");
    req.user = user;

    if (decoded?.storeId) {
      req.store = { _id: decoded?.storeId };
    } else {
      req.store = null;
    }
    next();
  } catch (error) {
    throw new apiError(400, `invalid accessToken ${error}`);
  }
});

export default verifyToken;
