import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from '../utils/getEnvVar.js';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('File buffer is required'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'avatars',
        transformation: [
          { width: 250, height: 250, crop: 'fill', gravity: 'face' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    const stream = Readable.from(file.buffer);
    stream.pipe(uploadStream);
  });
};

