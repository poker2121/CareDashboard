import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv'
dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.CLOUD_KEY //  API Keys IN .env FILE
});

export default cloudinary;
