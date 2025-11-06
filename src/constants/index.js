import path from 'node:path';

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
};

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
