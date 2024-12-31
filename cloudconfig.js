const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,  // Corrected typo here
    api_key: process.env.CLOUD_API_KEY,  // Corrected typo here
    api_secret: process.env.CLOUD_API_SECRET_KEY,
 });
// cloudinary.config({
//    api_cloud_name:process.env.CLOUD_NAME,  
// api_coud_api_key:process.env.CLOUD_API_KEY,
// api_secret:process.env.CLOUD_API_SECRET_KEY,
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      allowedFormats:["png","jpg","jpeg"], // supports promises as well
    
    },
  });
  
  module.exports={
    cloudinary,
    storage
  }