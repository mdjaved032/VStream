import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
  // get user details from fontend
  // validation - not empty
  // check if user already exists - userName, email
  // check for image, avatar, 
  // upload them to cloudinary - avatar
  // create user object - create entry in db
  // remove password and refreash token key from responce
  // check for user creation 
  // return response

  
  const { fullName, username, email, password } = req.body()
  // console.log("email: ", email)

  
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required")
  }

  
  const userExists = User.findOne({
    $or: [{ fullName }, { email }]
  })

  if (userExists) {
    throw new apiError(409, "User with email or username already exists")
  }

  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar is required")
  }

  
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new apiError(500, "failed to upload avatar to cloudinary ")
  }

  
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  })

  
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  
  if (!createdUser) {
    apiError(500, "Something went wrong while registering the user")
  }

  
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

export {registerUser};