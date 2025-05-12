import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,      
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET       
});
console.log(process.env.CLOUD_NAME);
console.log(process.env.API_KEY);

export default cloudinary;
