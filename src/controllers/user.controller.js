import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userid) => {
  
  try {
    const user = await User.findOne(userid)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateAccessToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
    
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens")
  }

}

const registerUser = asyncHandler( async (req, res) => {
  // get user details from fontend
  // validation - not empty
  // check if user already exists - userName, email
  // check for image, avatar, 
  // upload them to cloudinary - avatar
  // create user object - create entry in db
  // remove password and refresh token key from responce
  // check for user creation 
  // return response

  
  const { fullName, username, email, password } = req.body
  // console.log("email: ", email)
  // console.log(req.body)

  
  if (
    [fullName, username, email, password].some((field) => (!field) || field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required")
  }

  
  const userExists = await User.findOne({
    $or: [{ fullName }, { email }]
  })

  if (userExists) {
    throw new ApiError(409, "User with email or username already exists")
  }

  
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar is required")
  }

  
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(500, "failed to upload avatar to cloudinary ")
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
    ApiError(500, "Something went wrong while registering the user")
  }

  
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

const loginUser = asyncHandler( async (req, res) => {
  // get user data from frontend
  // username or email
  // check if user exists
  // password check
  // generate access token and refresh token
  // remove password and refresh token
  // send cookie

  const { username, email, password} = req.body


  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }


  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "user does not exist")
  }


  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }


  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)


  const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ")
  

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
      {
      user: loggedInUser, accessToken
      },
      "User logged In Successfully"
    )
  )

})

const logOutUser = asyncHandler( async (req, res) => {

  // update refresh token in db
  // remove cookies from browser
  // return response

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    }
    // {  // in this it doesn't matter
    //   new: true 
    // }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json( new ApiResponse(200, {}, "User logged out successfully"))
})

export {
  registerUser,
  loginUser,
  logOutUser
};