import { asyncHandler } from "../utils/asyncHandler.js";
import { apierror } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";

export const verifyjwt = asyncHandler(async function(req, res, next){

   try {
     const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "")
 
     if (!accessToken) {
      return res.redirect('/login');
     }
     
     const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
     
     const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken");
     
     
     if (!user) {
      return res.redirect('/login');
     }
 
     req.user = user;
     next()

   } catch (error) {
    console.log(error);
   }

})