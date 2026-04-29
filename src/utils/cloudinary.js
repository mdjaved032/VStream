import { v2 as cloudinary} from "cloudinary";
import fs from "fs";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        
        // file has been uploaded successfully
        try {
            fs.unlinkSync(localFilePath)
            console.log("local files removed successfully, response.url");
        } catch (unlinkError) {
            console.log("unlink-error: " + unlinkError.message);
        }
        return response;

    } catch (error) {
        try {
            fs.unlinkSync(localFilePath)
            console.log("local files removed successfully");
        } catch (unlinkError) {
            console.log("unlink-error: " + unlinkError.message);
        }
        return null;
    }
}


export {uploadOnCloudinary}