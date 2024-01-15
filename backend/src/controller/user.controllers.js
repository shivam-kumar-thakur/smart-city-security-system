import { User } from "../models/users.models.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import asyncHandler from "../utils/asynchandler.js"

import { GatheredData } from "../models/gatheredData.models.js"
const generateAccessAndRefreshToken= async(userId) => {
    try{
        const user=await User.findById(userId)
        const accessToken=await user.generateAccessToken()
        const refreshToken=await user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}

    }
    catch(err){
        throw new ApiError(500,"Something went wrong while generating access and refresh token.")
    }
}

const registerUser= asyncHandler( async (req,res)=>{
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {number,password}=req.body
    console.log(number,password)
    console.log("request have : ",req.files)

    if([number,password].some((feild)=> feild?.trim()===""))
    {
           throw new ApiError(400,"Feildds are required.")
    }

    const existedUser=await User.findOne({number})

    if(existedUser)
    {
        throw new ApiError(409, "user already existed")
    }

    const user=await User.create({
        number,password
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser){
        throw new ApiError(500,"something went wrong while creating user")
    }

    return res.status(201).json(new ApiResponse(200,"User registered successfully",createdUser))
})

const loginUser= asyncHandler( async (req,res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    const {number,password}=req.body
    if (!number || !password)
    {
        throw new ApiError(400,"username or passwrod incorrect.")
    }

    const user=await User.findOne({number})
    if(!user){
        throw new ApiError(404,"user doesnot exist")
    }

    const isPasswordValid=await user.isPasswordValid(password)
    if (!isPasswordValid)
    {
        throw new ApiError(400, "Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const logedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            "User logged In Successfully",
            {
                user: logedInUser, accessToken, refreshToken
            }
        )
    )
})

const logoutUser=asyncHandler(async(req,res) => {
    await User.findById(req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {  // so that new updated document will return
            new: true
        })
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler( async (req,res)=>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unautorized request")
    }

    try{
        const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user=await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    }
    catch(err){
                throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})



const addData=asyncHandler( async (req,res)=>{

    const user=await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(404,"User Not exist")
    }

     // Using the create method to create a new GatheredData document
    const newData = await GatheredData.create({
            animal: req.body.animal || 0,
            auto: req.body.auto || 0,
            bike: req.body.bike || 0,
            bus: req.body.bus || 0,
            car: req.body.car || 0,
            carrier_vehicle: req.body.carrier_vehicle || 0,
            cycle: req.body.cycle || 0,
            driver: req.body.driver || 0,
            electric_pole: req.body.electric_pole || 0,
            electric_poll: req.body.electric_poll || 0,
            num_plate: req.body.num_plate || 0,
            passenger: req.body.passenger || 0,
            pedestrain: req.body.pedestrain || 0,
            person: req.body.person || 0,
            scooty: req.body.scooty || 0,
            coordinates: {
              type: 'Point',
              coordinates: req.body.coordinates || [0, 0], // Assuming [0, 0] as default if not provided
            },
            // Add any other necessary details here
    });

          
    if (!newData){
        throw new ApiError(500,"Something went wrong while getting data.")
    }

    user.userDetails.push(newData._id)

    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(200, user, "details updated successfully"))

})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    addData
}