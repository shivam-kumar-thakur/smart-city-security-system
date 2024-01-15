import {V2 as cloudinary } from "cloudinary"
import fs from "fs" // bydefault with node
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret:process.env.API_SECRET_CLOUDINARY
});


const uploadOnCloudinary= async (localFilePath) =>{
    try{
		if(!localpath) return null
		// upload file, resource type i.e txt etc so auto we put

		const response = await cloudinary.uploader.upload(localpath,{ resource_type: "auto"})
		console.log("done" , response.url);
		return response;
	}
	catch(error){
		fs.unlinkSync(localFilePath) //remove file from server our
		return null;
	}
}