import cloudinary from 'cloudinary';
import crypto from 'crypto';
import { Request, Response } from 'express';

// Configura Cloudinary con tus credenciales
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getCloudinarySignature = (req: Request, res: Response) => {
    // Genera una firma
    const params: { [key: string]: string | number } = {
      timestamp: Date.now() / 1000,
      upload_preset: 'ts_mern_ecommerce',
    };
  
    // Create the string to sign
    const stringToSign =
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join('&') + process.env.CLOUDINARY_API_SECRET;
  
    // Generate the signature
    const signature = crypto
      .createHash('sha256')
      .update(stringToSign)
      .digest('hex');
  
    // Return the signature and timestamp
    res.json({ signature, timestamp: params.timestamp });
  };

export { getCloudinarySignature };
