import asyncHandler from "../utils/asyncHandler"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiErrors"
import { User } from "../models/users.models.js";


export const verifyJWT=asyncHandler( async (req,_,next)=>{
    try{
        const tocken=req.cookies?.accessToken || req.header("Authorization").replace("Bearer ","")

        if(!tocken){
            throw new ApiError(401,"Unauthorized access")
        }

        const decodedToken=jwt.verify(tocken, process.env.ACCESS_TOKEN_SECRET)
        const user= await UserActivation.findById(decodedToken?._id).select("-passwrod -refreshToken")
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user=user;
        next()
    }
    catch(error){
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})